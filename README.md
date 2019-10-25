# Import / Export

# Por que existe?

Antes de surgirem, CommonJS e AMD atendiam as necessidades de servidor e cliente, respectivamente. Essa diferença surgiu por particularidades necessárias em cada ambiente. Clientes precisavam que seus módulos fossem importados de forma assíncrona ou síncrona dependendo da situação, enquanto que Servidores ja bastavam que as importações fossem síncronas.

## CommonJS

```js
// sum.js
function sum(a, b) {
  return a + b;
}

module.exports = sum;

// index.js
var sum = require('./sum');

console.log(sum(2, 8));
```

## AMD

```js
// sum.js
define(
  'sum', // Define nome do módulo
  ['a', 'b'], // Define nome dos parâmetros
  function(a, b) { // Define a função a ser chamada
      return a + b;
  },
);

// index.js
require(['./sum.js'], function(sum) {
  console.log(sum(2, 8));
});
```

# ECMAScript

Com o surgimento do ECMAScript 2015 ou (ES6) dentre várias features que nasceram podemos citar os **módulos**. Essa, foi uma forma padronizada para importar e exportar onde Servidor (servers) e Clientes (browsers) entendessem.

```js
// sum.js
function sum(a, b) {
  return a + b;
}

export default sum;

// index.js
import sum from './sum';

console.log(sum(2, 8));
```

O único problema é que ECMAScript é uma **especificação** e suas mudanças acontecem em um processo lento, pois cada host (browsers, engines, etc) precisam implementar essa nova especificação para que possamos usar sem restrições.

Mais sobre qual feature já foi implementada nativa e em quais browsers pode ser consultado [aqui](https://kangax.github.io/compat-table/es6).

# Medidas provisórias, não tão provisórias

Para que não haja impeditivos e os desenvolvedores possam utilizar as últimas features estabelecidas pelo ECMAScript, **Traspiladores** surgiram para ajudar nisso. Transpilar é a forma de traduzir o que escrevemos para uma outra linguagem ou para a mesma linguagem, mas com uma transformando no código. Em tópicos, transpilar é:

* Importante quando queremos escrever um código em uma linguagem (e.g. JavaScript) para outra (e.g C++).
* Ou quando queremos trazer o nosso código escrito na mesma linguagem utilizando novas especificações *equivalentes* a antigas especificações.
* Ou quando transformamos o que escrevemos de uma forma mais enxuta para algo mais verboso. (e.g escrever em JSX e no futuro transpilado para React.createElement)

Alguns browsers não implementaram boa parte dessas features então acabou sendo muito comum utilizar os Transpiladores para todo build em produção. O transpilador mais conhecido hoje é o [**Babel**](https://babeljs.io).

Com o [**Node**](https://nodejs.org/en) na versão v10+ é possível utilizar import e export nativamente. Mas, em versões anteriores, onde vivem as principais aplicações mundo afora, isso ainda não é verdade. Se algum pacote instalado precisa rodar na versão 8 para funcionar, não poderiamos usar a feature *import/export* se não utilizassemos o Babel e ficariamos presos em fazer nossas importações e exportações com o CommonJS.

Exemplificando o que o Babel faz com nosso código é. Ele pega o exemplo escrito com `import` e `export` e transpila para `require` e `module.exports`. Assim, nossos módulos podem ser usados em versões mais antigas do Node, assim como em navegadores que ainda não suportam essa feature.

O Babel é muito importante para o desenvolvimento e provavelmente continuará existindo em nossos projetos.

# O que podemos fazer com o Import e Export?

Voltemos ao exemplo anterior.

```js
// sum.js
function sum(a, b) {
  return a + b;
}

export default sum;

// index.js
import sum from './sum';

console.log(sum(2, 8));
```

Esse pequeno trecho importa um módulo nomeado `sum` que quando utilizado retorna a soma de dois números passados por parâmetro.

Quando chamamos essa linha `import sum from './sum'` estamos importando um módulo que vive em `sum.js` no mesmo caminho que o arquivo de origem. Essa forma como importamos é chamada de **default import**. Uma outra forma muito comum é o **named import** que veremos a seguir.

## Default imports

Default imports podem ser usados desde que seja definido dessa forma explicitamente.

```js
// Isso só é possível
import sum from './sum';

// Se no arquivo sum.js é exportado o módulo default
export default sum;
```

Módulos padrão são importantes para que o time adote um padrão de uso na qual o nome do arquivo é nome do módulo default exportado. Nesse caso, `sum`. Isso permite criar associações intuitivas, facilitando a busca por algo dentro do projeto.

## Named imports

Named imports podem ser usados desde que seja definido dessa forma explicitamente.

```js
// Isso só é possível
import { sum } from './sum';

// Se no arquivo sum.js é exportado o módulo nomeado sum
export { sum };
```

Módulos nomeados são importantes para que o time adote um padrão na qual o nome do arquivo é nome do módulo default exportado. Nesse caso, `sum`. Isso permite criar associações intuitivas, facilitando a busca por algo dentro do projeto.

## Mil maneiras de Importar e Exportar

Pensando em casos comuns do dia a dia, como exportariamos mais de uma função, por exemplo? Criando duas funções `sum` e `sub` que realizaram operações matemáticas básicas e que vivem em um arquivo chamado `utils`.

```js
// utils.js
function sum(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

// Para que exportemos mais de uma coisa, é preciso definí-lo dentro de um objeto.
export default { sum, sub };

// ou criando um objeto primeiro antes de exportá-lo
const operations = { sum, sub };

export default operations;

// ou definindo as funções diretamente
export default {
  sum: function sum(a, b) {
    return a + b;
  },
  sub: function sub(a, b) {
    return a - b;
  },
}
```

Essa mesma lib de utils pode ser exportada utilizando os exports nomeados.

```js
// utils.js
function sum(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

// Para que exportemos mais de uma coisa, é preciso definí-lo dentro de um objeto
export { sum, sub };

// ou descontruindo o objeto operations e criando uma variavel para cada função criada
const operations = { sum, sub };

export const {
  sum: _sum, // Aqui renomeados sum para _sum para não colidir com a função criada anteriormente
  sub: _sub, // O mesmo vale para sub
} = operations;

// ou definindo as funções diretamente não considerando que as funções acima sum e sub existem.
export const { sum, sub } = {
  sum: function sum(a, b) {
    return a + b;
  },
  sub: function sub(a, b) {
    return a - b;
  },
};
```

Ambas implementações estão corretas e irão funcionar. A importação é indêntica a anterior, o que difere apenas é a forma de uso.

```js
// O que antes importavamos uma função
import sum from './sum';

console.log(sum(2, 8));

// Agora importamos aquele objeto definido no default export do módulo utils.
import myUtils from './utils';
// Ou pelo named export
import { sum }  from './utils';

// Um ponto importante aqui é que ao importar um módulo default, podemos dar qualquer nome a ele, mas por convenção é muito comum ser o nome do módulo.
console.log(myUtils.sum(2, 8));
// Ou com o named import
console.log(sum(2, 8));
```

Até aqui nada mudou, nao é mesmo? **Não, mudou sim!** Percebam que antes, importavamos o módulo sum e usavamos diretamente, agora importamos um objeto chamado `myUtils` onde vivem duas funções `sum` e `sub` e essa última não sendo utilizada. Essa afirmativa pode ser um pouco intuitiva e ingênua, mas esquecemos que isso tem um grande impacto em nosso produto final! Vamos entender o por que com um exemplo real e corriqueiro.

[Lodash ou _](https://lodash.com/) é uma biblioteca de utils bastante utilizada por desenvolvedores. Existe uma discussão bem ampla sobre o uso dela ou não que até criaram um [repositório](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore) para mostrar que não precisamos de Lodash na maioria dos casos. Se olharmos bem, o quantidade de métodos é *muito* grande.

Para termos o mesmo resultado que nosso `sum` ou `myUtils.sum` podemos usar o Lodash da seguinte forma.

```js
import _ from 'lodash';

console.log(_.sum([2, 8]));
```

Porém, quando o bundle final é gerado, **todos** (eu digo, todos mesmo!) os métodos definidos por `_` serão levados para o bundle final gerando consequências muito graves. Uma delas  é o impacto na experiência do usuário com o aumento do TTI (Time To Interactive) da sua aplicação pelo fato de ter que importar todo o Lodash na linha `import _ from 'lodash';` antes de pintar alguma coisa na tela.

![Lodash Example](https://i.imgur.com/yDjzVMk.png)

Tá. Entendemos o problema. Como resolver, agora? Quando geramos o bundle final para nosso usuário utilizando **Webpack**, **Rollup** ou **Parcel** esses bundlers são inteligentes o suficiente para eliminar esses códigos que não queremos, chamados de *código morto* (ou dead-code), através do Tree Shaking.

## Tree Shaking

Para que o Tree Shaking funcione e o código morto seja eliminado de maneira eficiente ele parte de 2 premissas.

* O código precisa ser definido estaticamente. Ou seja, ele pode ser completamente determinístico em tempo de compilação.
* O código não deve ser usado por ninguém.

A primeira premissa é **sempre verdade** por padrão, graças a feature de *import/export* . Isso explica o porque não conseguimos usar as keywords `import` e `export` atreladas a uma condição, com exceção do import dinâmico (ou *dynamic import*) que surgiu como uma proposta futura (stage-3) do ES6.

```js
if (Math.random()) {
  // Parsing error: 'import' and 'export' may only appear at the top level
  import sum from '/sum';
  // Já o require é aceito normalmente
  const sum = require('./sum');

  console.log(sum(2, 8));
} else {
  // Parsing error: 'import' and 'export' may only appear at the top level
  import sub from '/sub';
  // Já o require é aceito normalmente
  const sub = require('./sub');

  console.log(sub(2, 8));
}
```

Você receberia um erro em tempo de compilação do tipo `Parsing error: 'import' and 'export' may only appear at the top level` te mostrando que só é possível usar `import` e `export` no escopo mais alto.

A segunda premissa é de responsabilidade nossa. Ou seja, para que o bundler entenda o que deve remover ou não é necessário que fique explícito que não estamos utilizando em nenhum trecho da aplicação.

Portanto...

```js
// Importamos todo o lodash assim
import _ from 'lodash';
// Importamos **apenas** sum de todo o lodash, o resto é considerado dead-code
import { sum } from 'lodash';

console.log(_.sum([2, 8]));

console.log(sum([2, 8]));
```

Isso acarreta em um bundle reduzido e mais otimizado para o usuário final.

# O que o Bundle influencia afinal?

Entendemos que no Frontend, quando menor são aqueles scripts importados e mais assíncronos possíveis melhor é para o usuário devido ao baixo TTI.

Mas e o Backend?

AWS Lambda foi criado para que funções tenham um único objetivo dentro de um `handler`. O custo imposto por esse serviço é calculado pelo tempo de uso da máquina que hospeda esse `handler`. Abaixo o ciclo de vida de nossa função.

![AWS Lambda start ups](https://i.imgur.com/fvPtugB.png)

Perceba que existem otimizações de responsabilidade nossa e da AWS. É responsabilidade deles garantir a melhor forma de baixar nosso código e inicializar a máquina. Por outro lado, é responsabilidade nossa utilizarmos o melhor *runtime* e termos um código otimizado para que tenha uma rápida inicialização.

Mas o que seria rápido? Para que nosso código inicie e carregue em memória todas os pacotes necessários é preciso que nosso código utilize o mínimo necesário, sendo dever nosso nos importar com o tamanho final do bundle nesse contexto também.

Na imagem abaixo mostra um handler com todo o Lodash importado e um código não minificado (aumentando alguns bytes com espaços extras que o compilador não se importa).

![Lambda raw](https://i.imgur.com/SErDlc0.png)

Na próxima, o mesmo código porém com o bundler *Webpack* utilizado exclusivamente para gerar um código minificado e aplicando o Tree Shaking no Lodash.

![Lambda minified](https://i.imgur.com/jy2NSxF.png)

E só para mostrar que isso é importante, [Milkhail Shilkov](https://mikhail.io), um grande contribuinte do mundo Serverless, aborda alguns pontos sobre [como melhorar o cold start do AWS Lambda](https://mikhail.io/serverless/coldstarts/aws/). Dentre eles, o tamanho do bundle cresce consideravelmente o tempo de start das nossa aplicações.

![Lambda Graph Size](https://i.imgur.com/6c6h2O8.png)

Vemos que a diferença entre uma função de 1KB e 35MB cresce em muitos segundos, o que mostra que em aplicações de escala de bilhoes de usuários, isso pode prejudicar, em algum momento, a vida de seus usuários.

# Enfim

Se importe com o tamanho do seus bundles. Entenda que os Bundlers nasceram para nos ajudar em muita das etapas massivas que era produzir um código final otimizável, mas sabia que ainda é preciso ter responsabilidade para entregar o menor código possível que provocará um grande impacto na vida de nossos usuários.