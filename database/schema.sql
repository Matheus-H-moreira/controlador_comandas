CREATE TABLE  IF NOT EXISTS Mesas(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    NumeroMesa INT NOT NULL,
    QuantidadeClientes INT NOT NULL,
    status ENUM('livre', 'ocupada') DEFAULT 'livre'
);

CREATE TABLE  IF NOT EXISTS Comandas(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    MesaId INT NOT NULL,
    NomeCliente VARCHAR(100) NOT NULL,
    Status ENUM('em_preparo', 'pronto') NOT NULL DEFAULT 'em_preparo',

    FOREIGN KEY (MesaId) REFERENCES Mesas(Id) ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS ItensComanda(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ComandaId INT NOT NULL,
    ItemPedido VARCHAR(100) NOT NULL,
    QuantidadeItem INT NOT NULL,
    PrecoItem DECIMAL(10,2) NOT NULL,
    
    FOREIGN KEY (ComandaId) REFERENCES Comandas(Id) ON DELETE CASCADE
);

CREATE TABLE  IF NOT EXISTS Produtos (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    NomeProduto VARCHAR(100) NOT NULL,
    Preco DECIMAL(10,2) NOT NULL,
    Categoria VARCHAR(50)
);