const [, , ...args] = process.argv;

type Command =
  | { tag: "init" }
  | { tag: "run"; name: string }
  | { tag: "finish" };

console.log(arg);

// if (arg === "init") {
//   fs.readJsonSync(".ci.tmp.json")
// }
