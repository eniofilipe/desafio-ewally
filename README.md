# desafio-ewally

## Instalação
Para boa execução do código, é necessário que seja instalado os pacotes essênciais, para isso execute:

```bash
npm install
```

## Uso

Deve - se executar o comando abaixo a fim de executar o server e suas funcionalidades: 
```bash
npm start
```

Deve - se executar o comando abaixo a fim de executar os testes: 
```bash
npm test
```

## Requisições

GET - http://localhost:8080/boleto/:numeroBoleto
- 400 para linha inválida
- 200 para linha válida
- Quando é linha válida, é enviado informações do boleto: 
    * amount - string, valor do boleto; 
    * barCode - string, número do código de barras do boleto; 
    * expirationDate - string, data de vencimento do boleto; 
    