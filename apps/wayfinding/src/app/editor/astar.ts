export function findPath(
    links: [[number, number], [number, number]][],
    start: [number, number],
    end: [number, number]
): [number, number][] {
    console.log('Create Adjacency List', links);
    const adj_list = createAdjacencyList(links || []);
    console.log('Find Path', start, end, adj_list);
    const node_path = shortestPath(start, end, adj_list);
    const path = [];
    for (const [s, e] of node_path.entries()) path.push([s, e]);
    console.log('Path:', path);
    return path;
}

export function createAdjacencyList(
    links: [[number, number], [number, number]][]
) {
    const list = new Map<[number, number], Set<[number, number]>>();
    for (const [p1, p2] of links) {
        if (!list.has(p1)) {
            const set = new Set<[number, number]>([]);
            for (const link of links) {
                if (isSamePoint(link[0], p1)) set.add(link[1]);
                else if (isSamePoint(link[1], p1)) set.add(link[0]);
            }
            list.set(p1, set);
        }
        if (!list.has(p2)) {
            const set = new Set<[number, number]>([]);
            for (const link of links) {
                if (isSamePoint(link[0], p2)) set.add(link[1]);
                else if (isSamePoint(link[1], p2)) set.add(link[0]);
            }
            list.set(p2, set);
        }
    }
    return list;
}

export function shortestPath(
    start: [number, number],
    end: [number, number],
    adj_list: Map<[number, number], Set<[number, number]>>
) {
    const [end_x, end_y] = end;
    const node_list = new Set();
    const visited = new Set();
    let current = start;
    while (current !== end) {
        let next = null;
        node_list.add(current);
        visited.add(current);
        const list = Array.from(adj_list.get(current) || []);
        let shortest_distance = 99999;
        for (const node of list) {
            const [nx, ny] = node;
            const x = end_x - nx;
            const y = end_y - ny;
            const dist = Math.sqrt(x * x + y * y);
            if (dist < shortest_distance) {
                shortest_distance = dist;
                next = node
            }
        }
        console.log('Next:', next, shortest_distance, list);
        if (next) current = next;
        else break;
    }
    node_list.add(current);
    return node_list;
}

export function isSamePoint(
    [x1, y1]: [number, number],
    [x2, y2]: [number, number]
) {
    return x1 === x2 && y1 === y2;
}
