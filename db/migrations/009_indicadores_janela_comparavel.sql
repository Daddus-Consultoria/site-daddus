-- ---------------------------------------------------------------------------
-- Janela comparavel das series
-- ---------------------------------------------------------------------------
-- O SGS devolve a cotacao do dolar desde 1984 numa serie continua, mas o Brasil
-- trocou de moeda cinco vezes nesse periodo. O valor de 04/01/1993 e 12.531,50
-- cruzeiros; o de hoje e 5,15 reais. Os dois estao corretos como a origem os
-- publicou — e sao numeros de unidades diferentes.
--
-- Plotar os dois no mesmo eixo rotulado "R$" publica "R$ 71.153" como preco do
-- dolar, que e falso: aquilo eram cruzeiros. E o mesmo erro que a
-- docs/INDICADORES.md descreve para o rotulo do indicador ("publica um numero
-- certo com o nome de outro"), so que na unidade.
--
-- A coluna diz a partir de quando os valores da serie sao comparaveis entre si.
-- Ela nao apaga nem converte nada: o banco continua guardando a serie inteira
-- como a origem publicou, e o CSV continua entregando tudo. O que ela governa e
-- so ate onde o grafico pode desenhar uma linha unica com um rotulo unico.
--
-- NULL = a serie inteira e comparavel, que e o caso da maioria: taxa de juros e
-- indice de preco sao adimensionais e atravessam a troca de moeda sem problema
-- (a Selic de 1986 em % ao ano e comparavel a de hoje).
ALTER TABLE indicators
  ADD COLUMN IF NOT EXISTS comparable_from DATE;

COMMENT ON COLUMN indicators.comparable_from IS
  'A partir de quando os valores sao comparaveis entre si (troca de moeda, mudanca de base). NULL = serie inteira.';

-- 01/07/1994: primeiro dia do real, quando a serie do SGS passa a cotar R$ 1,00.
UPDATE indicators
   SET comparable_from = DATE '1994-07-01'
 WHERE slug = 'dolar'
   AND comparable_from IS DISTINCT FROM DATE '1994-07-01';
