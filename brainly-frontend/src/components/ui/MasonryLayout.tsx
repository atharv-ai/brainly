import { useMemo, type ReactNode } from "react";

type MasonryItem = {
    _id: string;
    type: string;
};

function estimateHeight(type: string): number {
    const t = type === "tweet" ? "twitter" : type;
    if (t === "twitter") return 520;
    if (t === "youtube") return 260;
    return 180;
}

function getColumnCount(itemCount: number): number {
    if (itemCount <= 1) return 1;
    if (itemCount === 2) return 2;
    return 3;
}

export function distributeToColumns<T extends MasonryItem>(items: T[], columnCount: number): T[][] {
    const columns: T[][] = Array.from({ length: columnCount }, () => []);
    const heights = Array.from({ length: columnCount }, () => 0);

    for (const item of items) {
        let shortest = 0;
        for (let i = 1; i < columnCount; i++) {
            if (heights[i] < heights[shortest]) shortest = i;
        }
        columns[shortest].push(item);
        heights[shortest] += estimateHeight(item.type);
    }

    return columns;
}

interface MasonryLayoutProps<T extends MasonryItem> {
    items: T[];
    renderItem: (item: T) => ReactNode;
}

export function MasonryLayout<T extends MasonryItem>({ items, renderItem }: MasonryLayoutProps<T>) {
    const columns = useMemo(() => {
        const count = getColumnCount(items.length);
        return distributeToColumns(items, count);
    }, [items]);

    return (
        <div className="flex gap-6 items-start">
            {columns.map((column, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-6">
                    {column.map((item) => (
                        <div key={item._id}>{renderItem(item)}</div>
                    ))}
                </div>
            ))}
        </div>
    );
}
