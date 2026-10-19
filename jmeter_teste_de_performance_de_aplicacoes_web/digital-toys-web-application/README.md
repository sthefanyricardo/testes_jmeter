# Digital Toys Web Application

Aplicação web de exemplo (*Digital Toys*) empacotada em formato `.war`, acompanhada de scripts de inicialização com Jetty Runner e banco de dados H2 embutido para testes de performance com Apache JMeter.

---

## 📌 Origem do Projeto

Esta aplicação pertence originalmente ao repositório do livro **Pro Apache JMeter** (Apress):
- **Repositório original:** [https://github.com/Apress/pro-apache-jmeter](https://github.com/Apress/pro-apache-jmeter)

---

## ⚠️ Pré-requisitos e Compatibilidade (Java JDK 8)

> [!IMPORTANT]
> Esta aplicação **funciona exclusivamente com o Java JDK 8**. Versões mais recentes do Java (Java 11, 17, 21+) causam erros de incompatibilidade no Jetty Runner e no framework da aplicação (como exceções de leitura do pacote `.war` e erros de carregamento de classes).

- **Versão requerida:** Java SE Development Kit 8 (JDK 1.8).
- **JDK utilizado / recomendado (Windows):** [Eclipse Adoptium Temurin JDK 8](https://adoptium.net/temurin/releases/?version=8).
  - Como configurado no script [startDt.bat](startDt.bat), a chamada utiliza o executável instalado no diretório do usuário:
    ```cmd
    "%LOCALAPPDATA%\Programs\Eclipse Adoptium\jdk-8.0.504.1-hotspot\bin\java.exe" -jar jetty-runner.jar dt-1.0.war
    ```
  - *Caminho padrão de instalação:*
    `C:\Users\<usuario>\AppData\Local\Programs\Eclipse Adoptium\jdk-8.0.504.1-hotspot\bin`

---

## 🚀 Como Executar

Para iniciar a aplicação localmente:

- **Windows:**
  ```cmd
  startDt.bat
  ```

- **Linux / macOS:**
  ```bash
  sh startDt.sh
  ```

A aplicação será iniciada via Jetty Runner e estará acessível no navegador em:
```text
http://localhost:8080/
```

---

## 📁 Arquivos Inclusos

- `dt-1.0.war`: Pacote web da aplicação Digital Toys.
- `jetty-runner.jar`: Servidor Jetty embutido para execução do arquivo `.war`.
- `prodDb.h2.db`: Banco de dados H2 pré-populado com produtos e categorias para os cenários de teste do JMeter.
- `startDt.bat` / `startDt.sh`: Scripts para inicialização rápida no Windows e Linux/macOS.
- `mylogin.properties`: Arquivo de credenciais/configurações locais da aplicação.
