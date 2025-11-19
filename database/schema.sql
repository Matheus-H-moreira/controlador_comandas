CREATE TABLE Mesas(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    NumeroMesa INT NOT NULL,
    QuantidadeClientes INT NOT NULL,
    status ENUM('livre', 'ocupada') DEFAULT 'livre'
);

CREATE TABLE Comandas(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    MesaNum INT NOT NULL,
    NomeCliente VARCHAR(100) NOT NULL,

    FOREIGN KEY (MesaNum) REFERENCES Mesa(NumeroMesa) ON DELETE CASCADE
);

CREATE TABLE ItensComanda(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ComandaId INT NOT NULL,
    Item VARCHAR(100) NOT NULL,
    Quantidade INT NOT NULL,
    Preco DECIMAL(10,2) NOT NULL,
    
    FOREIGN KEY (ComandaId) REFERENCES Comandas(Id) ON DELETE CASCADE
);