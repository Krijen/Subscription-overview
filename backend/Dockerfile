FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY Samle.API/Samle.API.csproj Samle.API/
RUN dotnet restore Samle.API/Samle.API.csproj
COPY . .
RUN dotnet publish Samle.API/Samle.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Samle.API.dll"]
