import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import { connectdb, Content, Links, Tags, User } from './db';
import { singupSchema, validContent } from './validation';
import { auth, tokencreate } from './jwtverify';
import { randomBytes } from 'crypto';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

connectdb();

app.post('/api/v1/signup', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const usereExist = await User.findOne({ username });

        if (usereExist) {
            return res.status(403).json({
                message: "User already exists with this username"
            });
        }

        const validuserpassword = singupSchema.safeParse({ username, password });
        if (!validuserpassword.success) {
            return res.status(411).json({
                message: "Error in inputs"
            });
        }

        const user = await User.create({
            username: username,
            password: password
        });

        return res.status(200).json({
            message: "Signed up",
            user: {
                username: user.username,
                _id: user._id
            }
        });
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Server error"
        });
    }
});

app.post('/api/v1/signin', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const validUser = await User.findOne({ username });
        if (!validUser) {
            return res.status(403).json({
                message: "Wrong username or password"
            });
        }

        if (validUser.password !== password) {
            return res.status(403).json({
                message: "Wrong username or password"
            });
        }

        const token = tokencreate(validUser._id);

        return res.status(200).json({
            token: token
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.post('/api/v1/content', auth, async (req, res) => {
    try {
        const { type, link, tags } = req.body;
        const title = req.body.title || req.body.tittle;
        const parsedTags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

        const validUser = validContent.safeParse({
            type,
            link,
            title,
            tags: parsedTags
        });

        if (!validUser.success) {
            return res.status(400).json({
                message: "Invalid input",
                error: validUser.error
            });
        }

        const tagIds = [];
        for (const tag of validUser.data.tags) {
            let existingTag = await Tags.findOne({ tittle: tag });
            if (!existingTag) {
                existingTag = await Tags.create({ tittle: tag });
            }
            tagIds.push(existingTag._id);
        }

        const contentItem = await Content.create({
            link: validUser.data.link,
            type: validUser.data.type,
            title: validUser.data.title,
            tags: tagIds,
            //@ts-ignore
            userId: req.userId
        });

        return res.status(200).json({
            message: "content has been added succesfully",
            content: contentItem
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server error" });
    }
});

app.get('/api/v1/content', auth, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const content = await Content.find({ userId }).populate("tags");
        return res.status(200).json({
            content
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "server error"
        });
    }
});

app.delete('/api/v1/content', auth, async (req, res) => {
    try {
        const body = req.body || {};
        const query = req.query || {};
        const contentId = body.contentId || body.id || query.contentId || query.id;
        if (!contentId) {
            return res.status(400).json({ message: "contentId is required" });
        }
        //@ts-ignore
        const userId = req.userId;
        const deleted = await Content.deleteOne({
            _id: contentId,
            userId
        });
        if (deleted.deletedCount === 0) {
            return res.status(404).json({ message: "Content not found or unauthorized" });
        }
        res.json({
            message: "deleted content"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "content not deleted"
        });
    }
});

app.put('/api/v1/content', auth, async (req, res) => {
    try {
        const { contentId, type, link, tags } = req.body;
        const title = req.body.title || req.body.tittle;
        //@ts-ignore
        const userId = req.userId;

        if (!contentId) {
            return res.status(400).json({ message: "contentId is required" });
        }

        const tagIds = [];
        if (Array.isArray(tags)) {
            for (const tag of tags) {
                const tagStr = typeof tag === 'string' ? tag : (tag.tittle || tag.title || '');
                if (!tagStr) continue;
                let existingTag = await Tags.findOne({ tittle: tagStr });
                if (!existingTag) {
                    existingTag = await Tags.create({ tittle: tagStr });
                }
                tagIds.push(existingTag._id);
            }
        }

        const updated = await Content.findOneAndUpdate(
            { _id: contentId, userId },
            { title, link, type, tags: tagIds },
            { new: true }
        ).populate("tags");

        if (!updated) {
            return res.status(404).json({ message: "Content not found or unauthorized" });
        }

        return res.status(200).json({ message: "Content updated successfully", content: updated });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Error updating content" });
    }
});


app.post('/api/v1/brain/share', auth, async (req, res) => {
    try {
        const { share } = req.body;
        //@ts-ignore
        const userId = req.userId;

        if (share) {
            const existingLink = await Links.findOne({ userId });
            if (existingLink) {
                existingLink.share = true;
                await existingLink.save();
                return res.status(200).json({
                    hash: existingLink.hash,
                    link: existingLink
                });
            }

            const hash = randomBytes(16).toString("hex");
            const link = await Links.create({
                hash: hash,
                userId,
                share: true
            });
            return res.status(200).json({
                hash: link.hash,
                link
            });
        }

        await Links.findOneAndUpdate(
            { userId },
            { share: false }
        );
        
        return res.status(200).json({ message: "Sharing disabled" });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "error creating link"
        });
    }
});

app.get('/api/v1/brain/:shareLink', async (req, res) => {
    try {
        const shareLink = req.params.shareLink;
        const link = await Links.findOne({ hash: shareLink });

        if (!link || !link.share) {
            return res.status(404).json({
                message: "Share link is invalid"
            });
        }

        const user = await User.findById(link.userId);
        const content = await Content.find({ userId: link.userId }).populate("tags");

        return res.status(200).json({
            username: user ? user.username : "User",
            content
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});