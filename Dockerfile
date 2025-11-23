# Build do backend
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# Copia o csproj e restaura dependências
COPY backend/*.csproj ./backend/
WORKDIR /app/backend
RUN dotnet restore

# Copia todo o código do backend
COPY backend/. ./backend
RUN dotnet publish -c Release -o out

# Build final com runtime leve
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app

# Copia os arquivos publicados do backend
COPY --from=build /app/backend/out ./

# Copia frontend para a mesma pasta (opcional, se você servir via .NET)
COPY frontend/. ./wwwroot

# Expõe porta
EXPOSE 5000

# Comando para rodar a API
ENTRYPOINT ["dotnet", "restauranteAPI.dll"]
