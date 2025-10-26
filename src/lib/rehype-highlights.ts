// import { visit } from "unist-util-visit";
// import { Highlight } from "./highlights";

// /**
//  * Rehype plugin to apply highlights to text nodes
//  * This properly renders highlights by manipulating the AST
//  */
// export function rehypeHighlights(highlights: Highlight[]) {
//   if (!highlights || highlights.length === 0) {
//     return (tree: any) => tree;
//   }

//   // Sort highlights by start offset for easier processing
//   const sortedHighlights = [...highlights].sort(
//     (a, b) => a.startOffset - b.startOffset
//   );

//   return (tree: any) => {
//     let currentOffset = 0;

//     visit(tree, "text", (node: any, index: number | undefined, parent: any) => {
//       if (!node.value || index === undefined) return;

//       const textStart = currentOffset;
//       const textEnd = currentOffset + node.value.length;
//       const originalText = node.value;

//       // Find highlights that overlap with this text node
//       const overlappingHighlights = sortedHighlights.filter(
//         (h) => h.startOffset < textEnd && h.endOffset > textStart
//       );

//       if (overlappingHighlights.length === 0) {
//         currentOffset = textEnd;
//         return;
//       }

//       // Build new children array with text and mark elements
//       const newChildren: any[] = [];
//       let lastEnd = 0;

//       for (const highlight of overlappingHighlights) {
//         // Calculate relative positions within this text node
//         const relativeStart = Math.max(0, highlight.startOffset - textStart);
//         const relativeEnd = Math.min(
//           originalText.length,
//           highlight.endOffset - textStart
//         );

//         // Add text before highlight
//         if (relativeStart > lastEnd) {
//           newChildren.push({
//             type: "text",
//             value: originalText.slice(lastEnd, relativeStart),
//           });
//         }

//         // Add highlighted text
//         newChildren.push({
//           type: "element",
//           tagName: "mark",
//           properties: {
//             "data-highlight-color": highlight.color || "yellow",
//             className: ["highlight"],
//           },
//           children: [
//             {
//               type: "text",
//               value: originalText.slice(relativeStart, relativeEnd),
//             },
//           ],
//         });

//         lastEnd = relativeEnd;
//       }

//       // Add remaining text after last highlight
//       if (lastEnd < originalText.length) {
//         newChildren.push({
//           type: "text",
//           value: originalText.slice(lastEnd),
//         });
//       }

//       // Replace the text node with the new children
//       if (newChildren.length > 0) {
//         parent.children.splice(index, 1, ...newChildren);
//       }

//       currentOffset = textEnd;
//     });
//   };
// }
