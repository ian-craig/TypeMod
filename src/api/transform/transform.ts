import * as ts from "typescript";

export type NodeSelector<TNode extends ts.Node> = (node: ts.Node) => node is TNode;
export type NodeVisitor<TNode extends ts.Node> = (node: TNode) => undefined;

export const transform = <TNode extends ts.Node>(
    sourceFile: ts.SourceFile,
    visitors: [NodeSelector<TNode>, ts.Transformer<TNode>][]
) => {
    const visitNode = (node: ts.Node) => {
        for (const [selector, transformer] of visitors) {
            if (selector(node)) {
                ts.transform(node, [() => transformer]);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(sourceFile, visitNode);
};
