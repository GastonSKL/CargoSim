FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 44338

ENV ASPNETCORE_URLS=http://+:44338

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["HahnCargoSim.csproj", "./"]
RUN dotnet restore "HahnCargoSim.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "HahnCargoSim.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "HahnCargoSim.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HahnCargoSim.dll"]
