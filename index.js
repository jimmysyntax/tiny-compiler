/**
 * TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER
 * TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER 
 * TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER TOKENIZER  
 */

// Lexical Analysis with the tokenizer
// Take our string of code and break it down into an array of tokens

const tokenizer = (input) => {
  // A `current` variable for tracking our position in the code like a cursor
  let current = 0;
  // A `token` array for pushing our tokens to
  let tokens = [];
  /**
   * Create a while loop to set up our `current` variable to be 
   * incremented as much as we want `inside` the loop
   * 
   * We do this because we want to increment `current` many times within
   * a single loop because our tokens can be any length
   */ 
  while (current < input.length) {
    // Store the `current` character in the `input`
    let char = input[current];
    /**
     * The first thing we want to check for is an open parenthesis.
     * This will later be used for `CallExpression` but for now
     * we only care about the character
     * 
     * We check to see if we have an open parenthesis
     */
    if (char === '(') {
      // Push a new token with the type 'paren' and set the value
      // to an open parenthesis
      tokens.push({
        type: 'paren',
        value: '('
      });
      // Increment the current
      current++;
      // Continue onto the next cycle of the loop
      continue;
    }
    /**
     * Next, we're going to check for the closing parenthesis
     * We do the exact same thing as before:
     * Check for the closing parenthesis
     * add a new token
     * increment current
     * continue
     */
    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      });
      current++;
      continue;
    }
    /**
     * Moving on, we need to check for white space.
     * We need to check for it becuase we need to know if it exists
     * to separate characters, but it isn't actually going to be stored
     * as a token. We would only throw it out later
     * 
     * Test for existence and it it does exist
     * just continue
     */
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    /**
     * The next type of token we'll check for is a number.
     * This is differenet because a number could be any number of characters
     * and we want to capture the entire sequence of characters as one token
     * 
     * We start this off when we encounter the first number in a sequence
     */
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      // We're going to create a `value` string that we are going
      // to push characters to
      let value = '';
      /**
       * Then, we're going to loop through each character in the
       * sequence until we encounter a character that is not a number,
       * pushing each character that is a number to our `value` and
       * incrementing `current` as we go
       */
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      // Push our `number` token to the `tokens` array
      tokens.push({ type: 'number', value });
      // And we continue on
      continue;
    }
    /**
     * Support for strings will include any text surrounded by double quotes
     * 
     * First, check for the opening quote
     */
    if (char === '"') {
      // Keep a `value` variable for building up our string token
      let value = '';
      // We'll skip the opening double quote in our token
      char = input[++current];
      // Then, we'll iterate through each character until we reach
      // another double quote
      while (char !== '"') {
        value += char;
        char = input[++current];
      }
      // Skip the closing double quote
      char = input[++current];
      // And add our `string` token to the `tokens` array
      tokens.push({ type: 'string', value });

      continue;
    }
    /**
     * The last type of token we'll accept is a name token
     * This is a sequence of letters instead of numbers,
     * that are the names of functions in our lisp syntax
     * 
     * (add 2 4)
     *  ^^^
     *  Name token
     */
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';
      // Again, we're just going to loop through all the letters
      // pushing them to a value
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }
      // And pushing that value as a token with the type `name` then continue
      tokens.push({ type: 'name', value });

      continue;
    }
    /**
     * Finally, if we have not matched a character by now,
     * we're going to throw an error and completely exit
     */
    throw new TypeError('I don\'t knpw what this character is: ' + char);
  }

  // Then at the end of our `tokenizer` we simply return the tokens array
  return tokens;
};

let tokens = tokenizer("(add 2 2)");
console.log("Tokens(STRING)\n", tokens);

/**
 * PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER
 * PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER 
 * PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER PARSER 
 */

// For our parser, we're going to take our array of tokens and turn
// it into an AST

// Define parser function that accepts our array of `tokens`
const parser = (tokens) => {
  // Again, keep a `current` variable that we'll use as a cursor
  let current = 0;
  // But this time, we're going to use recursion instead of a `while` loop,
  // so we define a `walk` function
  const walk = () => {
    // Inside the `walk` function, we start by grabbing the `current` token
    let token = tokens[current];
    /**
     * We're going to split each type of token off into a different code path,
     * starting off with `number` tokens
     * 
     * We test to see if we have a `number` token
     */
    if (token.type === 'number') {
      // If we have a number, we'll increment `current`
      current++;
      // And we'll return a new AST node called `NumberLiteral`
      // and setting its value to the value of our token
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }
    // If we have a string we'll do the same as number and create a 
    // `StringLiteral` node
    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }
    // Next, we're going to look for CallExpressions. We start this off
    // when we encounter an open parenthesis
    if (
      token.type === 'paren' &&
      token.value === '('
    ) {
      // We'll increment `current` to skip the parenthesis since we 
      // don't care about it in our AST
      token = tokens[++current];
      /**
       * We create a base node with the type `CallExpression`, and 
       * we're going to set the name as the current token's value
       * since the next token after the open parenthesis is the name
       * of the function
       */
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };
      // We increment `current` again to skip the name token
      token = tokens[++current];
      /**
       * Loop through each token that will be the `params` of our
       * `CallExpression` until we encounter a closing parenthesis
       * 
       * This is where the recursion comes in. Instead of trying to
       * parse a potentially infinitely nested set of ndoes, we're 
       * going to rely on recursion to resolve things
       * 
       * To explain this, let's take our Lisp code. You can see that the
       * parameters of the `add` are a number and a nested `CallExpression` that
       * includes its own numbers.
       *
       *   (add 2 (subtract 4 2))
       *
       * You'll also notice that in our tokens array we have multiple closing
       * parenthesis.
       *
       *   [
       *     { type: 'paren',  value: '('        },
       *     { type: 'name',   value: 'add'      },
       *     { type: 'number', value: '2'        },
       *     { type: 'paren',  value: '('        },
       *     { type: 'name',   value: 'subtract' },
       *     { type: 'number', value: '4'        },
       *     { type: 'number', value: '2'        },
       *     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
       *     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
       *   ]
       *
       * We're going to rely on the nested `walk` function to increment 
       * our `current` variable past any nested `CallExpression`
       * 
       * So, we'll create a `while` loop that will continue until
       * it encounters a token with a `type` of `paren` and a `value`
       * of a closing parenthesis
       */
      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        // We'll call the `walk` function which will return a `node` and
        // we'll push it into our `node.params`
        node.params.push(walk());
        token = tokens[current];
      }
      // Finally, we'll increment `current` one last time to skip
      // the closing parenthesis
      current++;
      // And return the node
      return node;
    }
    // Again, if we haven't recognized the token type by now, we're going
    // to throw an error
    throw new TypeError(token.type);
  };
  // Now, we're going to create our AST which will have a root which
  // is a `Program` node
  let ast = {
    type: 'Program',
    body: [],
  };
  /**
   * And we're going to kickstart our `walk` function, pushing nodes to
   * our `ast.body` array
   * 
   * The reason we are doing this inside a loop is because our program can
   * have `CallExpression` after one another instead of being nested
   * 
   * (add 2 2)
   * (subtract 4 2)
   */
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  // At the end of our parser, we'll return the ast
  return ast;
};

let AST = parser(tokens);
console.log("Abstract Syntax Tree(TOKENS)\n", AST);

/**
 * TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER
 * TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER 
 * TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER TRAVERSER  
 * 
 * So, now we have our AST, and we want to be ale to visit different nodes
 * with a visitor. We need to be able to call the methods on the visitor
 * whenever we encoutner a node with a mathcing type
 * 
 *    traverse(ast, {
 *     Program: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     CallExpression: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     NumberLiteral: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *   });
 */

// So we define a traverse function which accepts an AST and a visitor
// Inside we're going to define two functions
const traverser = (ast, visitor) => {
  // A `TraverseArray` function that will allow us to iterate over an array
  // and call the next function that we will define: `traverseNode`
  const traverseArray = (array, parent) => {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  };

  // `traverseNode` will accept a `node` and its `parent` node. So that it
  // can pass both to our visitor methods
  const traverseNode = (node, parent) => {
    // We start by testing for the existance of a method on the visitor 
    // with a matching `type`
    let methods = visitor[node.type];
    // If there is an `enter` method for this node type, we'll call it 
    // with the `node` and its `parent`
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }
    // Next, we're going to split things up by the current node type
    switch (node.type) {
      /**
       * We'll start with out top-level `Program`. Since Program nodes
       * have a property named body that has an array of nodes, we will
       * call `traverseArray` to traverse down into them
       * 
       * (Remember that `traverseArray` will in turn call `traverseNode`
       * so we are causing the tree to be traversed recursively)
       */
      case 'Program':
        traverseArray(node.body, node);
        break;
      // Next, we do the same with `CallExpression` and traverse their
      // `params`
      case 'CallExpression':
        traverseArray(node.params, node);
        break;
      // In the cases of `NumberLiteral` and `StringLiteral` we don't have 
      // any child nodes to visit, so we'll just break
      case 'NumberLiteral':
      case 'StringLiteral':
        break;
      // And again, if we haven't recognized the ndoe type, then we'll
      // throw an error
      default:
        throw new TypeError(node.type);
    }
    // If there is an `exit` method for this node type, we'll call it with
    // the `node` and its `parent`
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  };
  // Finally, we kickstart the traverse by calling `traverseNode` with our 
  // ast with no `parent` because the top-level of the AST doesn't have a parent
  traverseNode(ast, null);
};

/**
 * TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER
 * TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER 
 * TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER TRANSFORMER  
 */

/**
 * Next up, the transformer. Our transformer is going to take the AST that we
 * have built and pass it to our traverser function with a visitor and will
 * create a new ast.
 *
 * ----------------------------------------------------------------------------
 *   Original AST                     |   Transformed AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *  (sorry the other one is longer.)  |         }
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 * ----------------------------------------------------------------------------
 */

const transformer = (ast) => {
  // We'll create a `newAst` which like our previous AST will have a 
  // program node
  let newAst = {
    type: 'Program',
    body: [],
  };

  /**
   * This is cheating a little bit using a property named `context` on our
   * parent nodes that we're going to push nodes to their parent's `context`
   * Normally, you would have a better abstraction thant this, but for
   * our purposes this keeps things simple
   * 
   * Just take note that the context is a reference *from* the old ast *to*
   * the new ast
   */
  ast._context = newAst.body;
  // We'll start by calling the traverser function with our ast and a visitor
  traverser(ast, {
    // The first visitor method accepts `NumberLiteral`
    NumberLiteral: {
      // We'll visit them on enter
      enter(node, parent) {
        // We'll create a new node also named `NumberLiteral` that we will push
        // to the parent context
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      },
    },
    // Next we have a `StringLiteral`
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },
    // Next up, `CallExpression`
    CallExpression: {
      enter(node, parent) {
        // We start by creating a new node `CallExpression` with a nested
        // `Identifier`
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };
        /**
         * Next, we're going to defin a new context on the original
         * `CallExpression` node that will reference the `expression`'s
         * arguments so that we can push arguments
         */
        node._context = expression.arguments;
        // Then, we're going to check if the parent node is a `CallExpression`
        // If it is not...
        if (parent.type !== 'CallExpression') {
          /**
           * We're going to wrap our `CallExpression` node with an
           * `ExpressionStatement`. We do this because the top-level
           * `CallExpression` in JavaScript are actually statements
           */
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }
        // Last, we push our (possibly wrapped) `CallExpression` to the
        // `parent`'s `context`
        parent._context.push(expression);
      },
    }
  });
  // At the end of our transformer function, we'll just return the new ast
  // that we just created
  return newAst;
};

/**
 * CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR 
 * CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR 
 * CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR CODE-GENERATOR 
 */

/**
 * This is the last phase: The Code Generator
 * 
 * Our code generator is going to recursively call itself to print each node
 * in the tree into one giant string.
 */

const codeGenerator = (node) => {
  // We'll break things down by the `type` of the `node`
  switch (node.type) {
    // If we have a `Program` node, we'll map through each node in the `body`
    // and run them through the code generator and join them with a newline.
    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');
    // For `ExpressionStatement` we'll call the code generator on the
    // nested expression and we'll add a semicolon
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) + 
        ';' // << (...because we like to code the *correct* way)
      );
    /**
     * For `CallExpression` we'll print the `callee`, add an open parenthesis
     * we'll map through each node in the `arguments` array and run them
     * through the code generator, joining them with a comma, and then
     * we'll add a closing parenthesis
     */
    case 'CallExpression':
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );
    // For `Identifier` we'll just return the `node`'s value
    case 'Identifier':
      return node.name;
    // For `NumberLiteral` we'll just return the `node`'s value
    case 'NumberLiteral':
      return node.value
    // For `StringLiteral` we'll add quotations arounf the `node`'s value
    case 'StringLiteral':
      return '"' + node.value + '"';
    // And if we haven't recognized the node, we'll throw an error
    default:
      throw new TypeError(node.type);
  }
}

/**
 * COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER 
 * COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER 
 * COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER COMPILER 
 */

/**
 * FINALLY! We'll create our `compiler` function. Here we will link together
 * every part of the pipeline.
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */

const compiler = (input) => {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);
  // And simply return the output
  return output;
};

console.log(compiler('(add 2 (subtract 4 2))'));

module.exports = {
  tokenizer,
  parser,
  traverser,
  transformer,
  codeGenerator,
  compiler
}