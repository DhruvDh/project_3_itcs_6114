var inquirer = require('inquirer');


class Graph {
    constructor() {
        this.vertices = [];
        this.edges = [];
        this.numberOfEdges = 0;
    }

    addVertex(vertex) {
        this.vertices.push(vertex);
        this.edges[vertex] = [];
    }

    removeVertex(vertex) {
        const index = this.vertices.indexOf(vertex);
        if (index !== -1) {
            this.vertices.splice(index, 1);
        }
        while (this.edges[vertex].length) {
            const adjacentVertex = this.edges[vertex].pop();
            this.removeEdge(adjacentVertex, vertex);
        }
    }

    addEdge(a, b) {
        this.edges[a].push(b);
        this.edges[b].push(a);
        this.numberOfEdges++;
    }

    removeEdge(a, b) {
        let index = this.edges[a] ? this.edges[a].indexOf(b) : -1;
        if (index !== -1) {
            this.edges[a].splice(index, 1);
            this.numberOfEdges--;
        }
        index = this.edges[b] ? this.edges[b].indexOf(a) : -1;
        if (index !== -1) {
            this.edges[b].splice(index, 1);
        }
    }
}

function depthFirstSearchTraversal(root, tree) {
    var visited = {};
    visited[root] = 'None';

    recursionDFSvisit = function (source, tree) {
        if (tree[source]) {
            for (let i = 0; i < tree[source].length; i++) {
                const vertex = tree[source][i];
                if (!visited[vertex]) {
                    visited[vertex] = source;
                    recursionDFSvisit(vertex, tree);
                }
            }
        } else {
            console.log(source)
        }
    };
    // Search from start vertex root
    recursionDFSvisit(root, tree);
    return visited;
}

function breadth_first_search_traversal(root, graph) {
    const distance = { [root]: { distance: 0, parent: 'None' } };
    const queue = [root];
    while (queue.length) {
        const current = queue.shift();
        for (let i = 0; i < graph[current].length; i++) {
            const node = graph[current][i];
            if (!distance[node]) {
                distance[node] = { distance: distance[current].distance + 1, parent: current };
                queue.push(node);
            }
        }
    }
    return distance;
}

function dijkstra(graph, source) {
    const priorityQueueInsertOrUpdate = function (current) {
        for (var i = 0; i < priorityQueue.length; i++) {
            if (distance[current].distance > distance[priorityQueue[i]].distance) break;
        }
        priorityQueue.splice(i, 0, current);
    }

    const distance = { [source]: { distance: 0, parent: 'None' } };
    const priorityQueue = [source];

    while (priorityQueue.length) {
        const current = priorityQueue.shift();
        for (node in graph[current]) {
            const weigth = graph[current][node];
            if (!distance[node] || distance[node] > distance[current].distance + weigth) {
                distance[node] = { distance: distance[current].distance + weigth, parent: current };
                priorityQueueInsertOrUpdate(node);
            }
        }
    }
    return distance;
}

function check(matrix, root) {
    let bfs = depthFirstSearchTraversal(root, matrix)

    let colors = {}
    colors[root] = true;

    let prev = root;
    Object.keys(bfs).forEach(node => {
        if (bfs[node] != 'None') {
            colors[node] = !colors[prev];
            prev = node;
        }
    })

    let bipartite = true;
    prev = root;
    Object.keys(bfs).forEach(node => {
        if (bfs[node] != 'None') {
            if (colors[node] == colors[prev]) {
                bipartite = false;
            }
            prev = node;
        }
    })

    return bipartite;
}

function isBipartite(matrix) {
    let bipartite = true;
    Object.keys(matrix).forEach(node => {
        if (!check(matrix, node)) {
            bipartite = false;
        }
    })

    return bipartite
}

function topologicalSort(graph) {
    const result = [];
    const visited = [];
    const temp = [];

    const topologicalSortRecursion = function (node, visited, temp, graph, result) {
        temp[node] = true;
        const neighbors = graph[node];

        if (neighbors) {
            for (let i = 0; i < neighbors.length; i++) {
                const n = neighbors[i];
                if (temp[n]) {
                    throw new Error('The graph is not a DAG');
                }
                if (!visited[n]) {
                    topologicalSortRecursion(n, visited, temp, graph, result);
                }
            }
        }
        temp[node] = false;
        visited[node] = true;
        result.push(node);
    }
    for (let node in graph) {
        if (!visited[node] && !temp[node]) {
            topologicalSortRecursion(node, visited, temp, graph, result);
        }
    }
    return result.reverse();
};



function isTree(graph) {
    let children = new Set([])
    Object.keys(graph).forEach(node => {
        graph[node].forEach(child => children.add(child));
    })

    let outGoingEdges = new Set(
        [...Object.keys(graph)].filter(x => !children.has(x)));

    if (outGoingEdges.size != 1) {
        return false;
    } else {
        try {
            let x = topologicalSort(graph)
        } catch (e) {
            return false;
        }
    }

    return true;
}

{
    let graph = {};

    inquirer
        .prompt([{
            type: 'input',
            name: 'edges',
            message: "Enter set of edges in the graph: "
        }])
        .then((answers) => {
            let matrix = {}
            edges = Array.from(new Set(answers['edges'].split(' ')));
            console.log("Edges are: ", edges)

            let questions = []
            edges.forEach(edge => {
                questions.push({
                    type: 'input',
                    name: `${edge}`,
                    message: `Enter neighbors of ${edge}: `
                })
                matrix[edge] = []
            })

            inquirer
                .prompt(questions)
                .then((answers) => {
                    Object.keys(answers).forEach(edge => {
                        matrix[edge] = Array.from(new Set(answers[edge].split(' ')));
                        console.log(`${edge} -> ${matrix[edge]}`)
                    })

                    graph = matrix;
                    ask();
                }).catch(err => {
                    console.log("Something went wrong..\n\n");
                    console.log(err);
                })

        }).catch(err => {
            console.log("Something went wrong..\n\n");
            console.log(err);
        })

    function ask() {
        inquirer
            .prompt([{
                type: 'list',
                name: 'choice',
                message: "What would you like to do? ",
                choices: [
                    "1. Replace the graph",
                    "2. DFS on graph",
                    "3. BFS on graph",
                    "4. Dijkstra’s on graph",
                    "5. Check for cycles",
                    "6. Check for bipartiteness",
                    "7. Check if tree",
                    "8. Exit"
                ]
            }])
            .then(answers => {
                switch (answers['choice']) {
                    case "1. Replace the graph":
                        let edges = []
                        let matrix = {}

                        inquirer
                            .prompt([{
                                type: 'input',
                                name: 'edges',
                                message: "Enter set of edges in the graph: "
                            }])
                            .then((answers) => {
                                edges = Array.from(new Set(answers['edges'].split(' ')));
                                console.log("Edges are: ", edges)

                                let questions = []
                                edges.forEach(edge => {
                                    questions.push({
                                        type: 'input',
                                        name: `${edge}`,
                                        message: `Enter neighbors of ${edge}: `
                                    })
                                    matrix[edge] = []
                                })

                                inquirer
                                    .prompt(questions)
                                    .then((answers) => {
                                        Object.keys(answers).forEach(edge => {
                                            matrix[edge] = Array.from(new Set(answers[edge].split(' ')));
                                            console.log(`${edge} -> ${matrix[edge]}`)
                                        })

                                        graph = matrix;
                                        ask();
                                    }).catch(err => {
                                        console.log("Something went wrong..\n\n");
                                        console.log(err);
                                    })

                            }).catch(err => {
                                console.log("Something went wrong..\n\n");
                                console.log(err);
                            })
                        break;

                    case "2. DFS on graph":
                        inquirer.prompt([{
                            type: 'list',
                            name: 'source',
                            choices: [...Object.keys(graph)],
                            message: "From which vertex? "
                        }]).then(answers => {
                            console.log(`DFS traversal from ${answers['source']} goes in this order -\n`);
                            console.log(Object.keys(depthFirstSearchTraversal(answers['source'], graph)));

                            ask();
                        }).catch(err => {
                            console.log("Something went wrong..\n\n");
                            console.log(err);
                        })

                        break;

                    case "3. BFS on graph":
                        inquirer.prompt([{
                            type: 'list',
                            name: 'source',
                            choices: [...Object.keys(graph)],
                            message: "From which vertex? "
                        }]).then(answers => {
                            console.log(`BFS traversal from ${answers['source']} goes in this order -\n`);
                            console.log(Object.keys(depthFirstSearchTraversal(answers['source'], graph)));

                            ask();
                        }).catch(err => {
                            console.log("Something went wrong..\n\n");
                            console.log(err);
                        })

                        break;

                    case "4. Dijkstra’s on graph":
                        inquirer.prompt([{
                            type: 'list',
                            name: 'source',
                            choices: [...Object.keys(graph)],
                            message: "From which vertex? "
                        }]).then(answers => {
                            console.log(`Dijkstra’s from ${answers['source']}  -\n`);
                            let result = dijkstra(graph, answers['source'])
                            Object.values(result).forEach(row => {
                                if (row.distance != 0) {
                                    console.log(`${row.distance.slice(-1)} -> ${row.distance.slice(0, row.distance.length - 1)} from ${answers['source']}`)
                                }
                            })

                            ask();
                        }).catch(err => {
                            console.log("Something went wrong..\n\n");
                            console.log(err);
                        })

                        break;

                    case "5. Check for cycles":
                        try {
                            topologicalSort(graph)
                            let noCycle = true;

                            if (noCycle) {
                                console.log("Your graph is cycle-free since 1983.\n");

                                ask();
                            }
                        } catch (e) {
                            console.log("Seems like there is a cycle in your graph.\n");
                            ask();
                        }



                        break;


                    case "6. Check for bipartiteness":
                        if (isBipartite(graph)) {
                            console.log("Your graph seems to be Bipartite.\n");

                            ask();
                        } else {
                            console.log("Your graph is a lot of good things, but bipartite is not one of them.\n");

                            ask();
                        }

                        break;


                    case "7. Check if tree":
                        if (isTree(graph)) {
                            console.log("Yes, it is a tree. \nGood, we need it to fight global warming.\n");

                            ask();
                        } else {
                            console.log("Your graph is a lot of good things, but tree is not one of them.\n");

                            ask();
                        }

                        break;

                    case "8. Exit":
                        console.log("Alright, have a good day!");
                        break;

                }
            }).catch(err => {
                console.log("Something went wrong..\n\n");
                console.log(err);
            })
    }
} 