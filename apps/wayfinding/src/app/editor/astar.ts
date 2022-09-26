export function findPath(
    links: [[number, number], [number, number]][],
    start: [number, number],
    end: [number, number]
): [number, number][] {
    const adj_list = createAdjacencyList(links || []);
    const node_path = shortestPath(start, end, adj_list);
    const path = [];
    for (const [s, e] of node_path.entries()) path.push([s, e]);
    return path;
}

export function createAdjacencyList(
    links: [[number, number], [number, number]][]
) {
    const list = new Map<string, Set<[number, number]>>();
    for (const [p1, p2] of links) {
        let node_id = `${p1[0]},${p1[1]}`;
        if (!list.has(node_id)) {
            const set = new Set<[number, number]>([]);
            for (const link of links) {
                if (isSamePoint(link[0], p1)) set.add(link[1]);
                else if (isSamePoint(link[1], p1)) set.add(link[0]);
            }
            list.set(node_id, set);
        }
        node_id = `${p2[0]},${p2[1]}`;
        if (!list.has(node_id)) {
            const set = new Set<[number, number]>([]);
            for (const link of links) {
                if (isSamePoint(link[0], p2)) set.add(link[1]);
                else if (isSamePoint(link[1], p2)) set.add(link[0]);
            }
            list.set(node_id, set);
        }
    }
    return list;
}

export function shortestPath(
    start: [number, number],
    end: [number, number],
    adj_list: Map<string, Set<[number, number]>>
) {
    const [end_x, end_y] = end;
    const node_list = new Set();
    const visited = new Set();
    let current = start;
    let current_id = `${current[0]},${current[1]}`;
    const end_id =  `${end[0]},${end[1]}`;
    while (current_id !== end_id) {
        let next = null;
        node_list.add(current);
        visited.add(current_id);
        const list = Array.from(adj_list.get(current_id) || []);
        let shortest_distance = 99999;
        for (const node of list) {
            const [nx, ny] = node;
            const x = end_x - nx;
            const y = end_y - ny;
            const dist = Math.sqrt(x * x + y * y);
            if (dist < shortest_distance && !visited.has(`${node[0]},${node[1]}`)) {
                shortest_distance = dist;
                next = node
            }
        }
        if (next) current = next;
        else break;
        current_id = `${current[0]},${current[1]}`;
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
