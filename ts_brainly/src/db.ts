import mongoose from 'mongoose';

export async function connectdb(){
    const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://atharv:Atharv123@cluster1.3holro4.mongodb.net/brainly';
    await mongoose.connect(mongoUrl);
    console.log("database connected");
}

const user = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

const ContentSchema = new mongoose.Schema({

    link: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["document", "tweet", "twitter", "youtube", "link"],
        required: true
    },

    title: {
        type: String,
        required: true
    },

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags"
    }],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
});

const Tag = new mongoose.Schema({

    tittle: {
        type: String,
        required: true
    }
})

const Link = new mongoose.Schema({

    hash: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },

    share:{
        type: Boolean,
        required: true,
        default: false
    }
})


export const User = mongoose.model('User',user);
export const Content = mongoose.model('content',ContentSchema);
export const Tags = mongoose.model('tags',Tag);
export const Links = mongoose.model('Links',Link);
