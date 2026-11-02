# 🚀 Testes de Performance com Apache JMeter

Repositório dedicado ao estudo, desenvolvimento e execução de testes de desempenho, carga e estresse para aplicações web utilizando o **[Apache JMeter](https://jmeter.apache.org/)**.

---

## 📌 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Conceitos Praticados](#-conceitos-praticados)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar os Testes](#-como-executar-os-testes)
  - [0. Iniciando a Aplicação Alvo Local (Digital Toys)](#0-iniciando-a-aplicação-alvo-local-digital-toys)
  - [1. Modo Gráfico (GUI - Criação e Depuração)](#1-modo-gráfico-gui---criação-e-depuração)
  - [2. Modo Linha de Comando (CLI / Non-GUI - Recomendado)](#2-modo-linha-de-comando-cli--non-gui---recomendado-para-carga-real)
  - [3. Geração de Relatórios HTML (Dashboard)](#3-geração-de-relatórios-html-dashboard)
  - [4. Monitoramento de Servidor com PerfMon (ServerAgent)](#4-monitoramento-de-servidor-com-perfmon-serveragent)
- [Solução de Problemas (Troubleshooting)](#-solução-de-problemas-troubleshooting)
  - [Erro EXCEPTION_ACCESS_VIOLATION (sigar-amd64-winnt.dll) no ServerAgent / Windows 11](#erro-exception_access_violation-sigar-amd64-winntdll-no-serveragent--windows-11)
- [Boas Práticas em Testes com JMeter](#-boas-práticas-em-testes-com-jmeter)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Cursos e Certificações](#-cursos-e-certificações)
- [Autoria](#-autoria)

---

## 📖 Sobre o Projeto

Este repositório reúne planos de teste (`.jmx`), fragmentos reutilizáveis, massa de dados (`.csv`), resultados de execução (`.jtl`) e relatórios visuais gerados durante cursos e práticas de automação de testes de performance.

Os cenários cobrem desde requisições HTTP básicas até configurações avançadas com validações de tempo de resposta, códigos de status, análise sintática de HTML, parametrização dinâmica de dados, modularização com *Test Fragments* e *Include Controllers*, gravação de fluxos via Proxy (*Test Script Recorder*) e monitoramento de recursos de hardware em tempo real (*PerfMon*).

---

## 📂 Estrutura do Repositório

Os projetos seguem o padrão de mercado para engenharia de performance, separando **planos de teste (`plans/`)**, **massa de dados (`data/`)**, **logs brutos de execução (`results/`)** e **relatórios visuais (`reports/`)**:

```text
testes_jmeter/
├── aprenda_jmeter_em_1_hora_iniciante/
│   ├── plans/                                                   # Planos de teste (.jmx)
│   │   └── testes_curso_rapido_jmeter.jmx                       # Plano de teste principal do curso para iniciantes
│   ├── data/                                                    # Massa de dados (.csv)
│   │   └── gitgithub.csv                                        # Massa de dados para testes parametrizados (Data-Driven)
│   ├── results/                                                 # Logs brutos de execução (.jtl / .txt) — ignorados no Git
│   │   └── .gitkeep                                             # Mantém a estrutura da pasta no repositório
│   ├── reports/                                                 # Dashboards HTML gerados (-e -o) — ignorados no Git
│   │   └── .gitkeep                                             # Mantém a estrutura da pasta no repositório
│   └── Materiais Curso JMeter/                                  # Arquivos originais de apoio do curso
│
├── jmeter_teste_de_performance_de_aplicacoes_web/
│   ├── plans/                                                   # Planos de teste (.jmx)
│   │   ├── aula_controladores_logicos.jmx                       # Organização de fluxos com Controladores Lógicos (Simple, Loop, Interleave, Random, Runtime)
│   │   ├── aula_controladores_logicos_include_controller.jmx    # Modularização e reaproveitamento de scripts com Include Controller
│   │   ├── aula_introducao_requisicao_google.jmx                # Plano com requisição HTTP simples e amostradores
│   │   ├── aula_parametrizacao.jmx                              # Fluxo de Login/Logout parametrizado (CSV + Cookie Manager)
│   │   ├── aula_plano_teste_digital_toys.jmx                    # Plano de teste de carga na aplicação local Digital Toys
│   │   ├── aula_plugins.jmx                                     # Análise gráfica com plugins (jp@gc - Response Times Over Time)
│   │   ├── aula_plugins_perfmon.jmx                             # Monitoramento de CPU, Memória, Disco e Rede (jp@gc - PerfMon Metrics Collector)
│   │   ├── aula_temporizadores.jmx                              # Simulação de Think Time (Constant & Uniform Random Timer)
│   │   ├── aula_test_script_recorder.jmx                        # Gravação de fluxo completo de compra via Proxy (HTTP(S) Test Script Recorder)
│   │   ├── desafio_comparacao_google_vs_yahoo.jmx               # Desafio: 200 usuários comparando Google e Yahoo (90% Line)
│   │   └── login_digital_toys_application_fragment.jmx          # Test Fragment reutilizável com o fluxo de autenticação na Digital Toys
│   ├── data/                                                    # Massa de dados (.csv)
│   │   └── dados_login_digital_toys.csv                         # Credenciais para login parametrizado na Digital Toys
│   ├── results/                                                 # Logs brutos de execução (.jtl) — ignorados no Git
│   │   └── .gitkeep                                             # Mantém a estrutura da pasta no repositório
│   ├── reports/                                                 # Dashboards HTML gerados (-e -o) — ignorados no Git
│   │   └── .gitkeep                                             # Mantém a estrutura da pasta no repositório
│   └── digital-toys-web-application/                            # Aplicação web alvo local (WAR, Jetty Runner, BD H2)
│       ├── dt-1.0.war                                           # Pacote da aplicação web Digital Toys
│       ├── jetty-runner.jar                                     # Servidor Jetty embarcado
│       ├── startDt.bat                                          # Script de inicialização no Windows (porta 8080)
│       └── startDt.sh                                           # Script de inicialização no Linux/macOS
│
├── .gitignore                                                   # Regras de exclusão (bancos H2, logs .jtl e relatórios gerados)
└── README.md                                                    # Documentação geral do repositório
```

---

## 🎯 Conceitos Praticados

Durante as práticas implementadas neste repositório, foram explorados os principais componentes do ecossistema do JMeter:

| Componente | Função |
| :--- | :--- |
| **Thread Group** | Simulação da quantidade de usuários virtuais concorrentes, tempo de subida (*ramp-up*), duração fixa (*Thread lifetime*) e ciclos de iteração (*loops*). |
| **HTTP Request Sampler** | Envio de requisições HTTP/HTTPS (`GET`, `POST`, etc.) parametrizando domínios, caminhos, portas e *payloads*. |
| **HTTP Request Defaults** | Centralização de configurações padrão (protocolo, servidor, porta e *encoding*) para evitar repetição nos *Samplers*. |
| **HTTP Cookie Manager** | Armazenamento e envio automático de *cookies* de sessão (`JSESSIONID`) entre requisições em fluxos autenticados. |
| **User Defined Variables** | Definição de variáveis globais no Plano de Teste (ex.: `${servidor}`, `${porta}`) para fácil manutenção de ambientes. |
| **CSV Data Set Config** | Execução de testes orientados a dados (*Data-Driven Testing*), lendo massas dinâmicas de usuários e senhas de arquivos `.csv`. |
| **Timers (Constant / Uniform Random)** | Simulação de *Think Time* (tempo de reflexão do usuário real) aplicando pausas fixas ou aleatórias entre requisições. |
| **Logic Controllers** | Controle de fluxo de execução das requisições (*Simple*, *Loop*, *Interleave*, *Random*, *Runtime* e *Recording Controller*). |
| **Test Fragment & Include Controller** | Modularização de fluxos comuns (como autenticação em `login_digital_toys_application_fragment.jmx`) para reaproveitamento em múltiplos planos de teste. |
| **HTTP(S) Test Script Recorder** | Captura e gravação de fluxos de navegação reais do usuário através de servidor proxy local (porta `8888`) com filtros de exclusão de arquivos estáticos. |
| **JMeter Plugins (`jp@gc`)** | Extensão do JMeter via *Plugins Manager* com gráficos avançados (*Response Times Over Time*) e coleta de telemetria. |
| **PerfMon Metrics Collector & ServerAgent** | Monitoramento em tempo real da saúde do servidor alvo (CPU, Memória, Disks I/O e Network I/O) na porta `4444`. |
| **Assertions (Response / Duration / HTML)** | Validação automatizada de regras de negócio (`200 OK`), conformidade de SLA em milissegundos e integridade sintática do HTML. |
| **Listeners & Relatórios** | Coleta de métricas como *Throughput*, Latência, Tempo de Conexão, Percentis (90%, 95%, 99%), APDEX e Taxa de Erros. |

---

## ⚙️ Pré-requisitos

Para abrir e executar os testes deste repositório, você precisará de:

1. **Java JDK 8 ou superior**:
   - **Para o Apache JMeter 5.6.3:** **[Azul Zulu OpenJDK 25 LTS](https://www.azul.com/downloads/?os=windows&package=jdk#zulu)** (`C:\Program Files\Java\zulu25.36.205-ca-jdk25.0.4.1-win_x64`)
     - `JAVA_HOME`: `C:\Program Files\Java\zulu25.36.205-ca-jdk25.0.4.1-win_x64`
     - `PATH`: `%JAVA_HOME%\bin`
   - **Para a aplicação Digital Toys (Jetty Runner) e PerfMon ServerAgent:** **Eclipse Adoptium OpenJDK 8 (HotSpot 64-bit)**
     - Caminho local: `C:\Users\sthef\AppData\Local\Programs\Eclipse Adoptium\jdk-8.0.504.1-hotspot\bin\java.exe`

2. **Apache JMeter 5.6.X** ([Download oficial](https://jmeter.apache.org/download_jmeter.cgi)):
   - **Versão utilizada:** `5.6.3`
   - **Caminho de instalação:** `C:\apache-jmeter-5.6.3`
   - **Executável GUI:** `C:\apache-jmeter-5.6.3\bin\jmeter.bat`
   - **Plugins instalados (via JMeter Plugins Manager):**
     - *3 Basic Graphs* (`jp@gc - Response Times Over Time`, `Active Threads Over Time`, `Transactions per Second`)
     - *PerfMon (Servers Performance Monitoring)* (`jp@gc - PerfMon Metrics Collector`)

3. **PerfMon ServerAgent 2.2.3** (para o plano `aula_plugins_perfmon.jmx`):
   - **Caminho de instalação:** `C:\apache-jmeter-5.6.3\ServerAgent-2.2.3`
   - **Executável:** `C:\apache-jmeter-5.6.3\ServerAgent-2.2.3\startAgent.bat`

---

## 🚀 Como Executar os Testes

### 0. Iniciando a Aplicação Alvo Local (Digital Toys)

Os planos de teste voltados à aplicação local **Digital Toys** (`http://localhost:8080`) requerem que o servidor Jetty esteja em execução. Para iniciá-lo com o OpenJDK 8:

```powershell
cd jmeter_teste_de_performance_de_aplicacoes_web/digital-toys-web-application
& "C:\Users\sthef\AppData\Local\Programs\Eclipse Adoptium\jdk-8.0.504.1-hotspot\bin\java.exe" -jar jetty-runner.jar dt-1.0.war
```

> ℹ️ O servidor Jetty será iniciado na porta `8080`. Mantenha esse terminal aberto enquanto executa os testes no JMeter.

---

### 1. Modo Gráfico (GUI - Criação e Depuração)

> ⚠️ **Atenção:** Utilize a interface gráfica **somente** para construir, editar ou validar os scripts. Não execute testes de carga pesada pela interface gráfica.

1. Navegue até a pasta `C:\apache-jmeter-5.6.3\bin` e execute **`jmeter.bat`**.
2. No menu superior do JMeter, vá em **File > Open** (`Ctrl + O`) e selecione o plano desejado em `plans/`.
3. Clique no botão verde **Start (Play)** (ou pressione `Ctrl + R`) para iniciar.

---

### 2. Modo Linha de Comando (CLI / Non-GUI - Recomendado para Carga Real)

Para simulações de carga reais e coletas de métricas precisas, execute o JMeter em modo *headless* (sem interface gráfica):

```bash
"C:\apache-jmeter-5.6.3\bin\jmeter.bat" -n -t "aprenda_jmeter_em_1_hora_iniciante/plans/testes_curso_rapido_jmeter.jmx" -l "aprenda_jmeter_em_1_hora_iniciante/results/resultado_execucao.jtl"
```

**Parâmetros utilizados:**
- `-n`: Executa em modo non-GUI (linha de comando).
- `-t`: Caminho para o arquivo do Plano de Teste (`.jmx`).
- `-l`: Caminho para o arquivo de log de saída com os resultados (`.jtl` ou `.csv`).

---

### 3. Geração de Relatórios HTML (Dashboard)

O JMeter pode gerar automaticamente um dashboard interativo completo (com gráficos de TPS, tempos de resposta, APDEX e erros):

#### A) Executar o teste e gerar o relatório ao mesmo tempo:
```bash
"C:\apache-jmeter-5.6.3\bin\jmeter.bat" -n -t "aprenda_jmeter_em_1_hora_iniciante/plans/testes_curso_rapido_jmeter.jmx" -l "aprenda_jmeter_em_1_hora_iniciante/results/resultado.jtl" -e -o "aprenda_jmeter_em_1_hora_iniciante/reports/dashboard_output"
```

#### B) Gerar o relatório a partir de um arquivo `.jtl` já existente:
```bash
"C:\apache-jmeter-5.6.3\bin\jmeter.bat" -g "aprenda_jmeter_em_1_hora_iniciante/results/resultados-tabela.jtl" -o "aprenda_jmeter_em_1_hora_iniciante/reports/meu_novo_dashboard"
```

---

### 4. Monitoramento de Servidor com PerfMon (ServerAgent)

Para executar o plano `jmeter_teste_de_performance_de_aplicacoes_web/plans/aula_plugins_perfmon.jmx` e coletar métricas de **CPU**, **Memory**, **Disks I/O** e **Network I/O**:

1. Extraia o `ServerAgent-2.2.3.zip` em uma pasta dedicada (ex.: `C:\apache-jmeter-5.6.3\ServerAgent-2.2.3`).
2. Configure o `startAgent.bat` para utilizar o OpenJDK 8:
   ```bat
   @echo off
   "C:\Users\sthef\AppData\Local\Programs\Eclipse Adoptium\jdk-8.0.504.1-hotspot\bin\java.exe" -jar "%~dp0CMDRunner.jar" --tool PerfMonAgent %*
   ```
3. Inicie o agente pelo Prompt de Comando (CMD):
   ```cmd
   cd C:\apache-jmeter-5.6.3\ServerAgent-2.2.3
   startAgent.bat
   ```
4. Confirme que o agente está escutando na porta `4444` (`Binding UDP to 4444` / `Binding TCP to 4444` / `JP@GC Agent v2.2.3 started`) e execute o teste no JMeter.

---

## 🔧 Solução de Problemas (Troubleshooting)

### Erro `EXCEPTION_ACCESS_VIOLATION (sigar-amd64-winnt.dll)` no ServerAgent / Windows 11

#### Problema apresentado
Ao iniciar a coleta de métricas no JMeter 5.6.3 com o **PerfMon Metrics Collector** e o **ServerAgent 2.2.3** no Windows 11 (64 bits), o ServerAgent encerra inesperadamente com o erro:

```text
# A fatal error has been detected by the Java Runtime Environment:
#   EXCEPTION_ACCESS_VIOLATION (0xc0000005)
# Problematic frame:
#   C  [sigar-amd64-winnt.dll+0x14ed4]
```

Consequentemente, o JMeter permanece com a mensagem `Waiting for samples...` e registra `java.net.SocketException: Connection reset by peer` ao final do teste. Isso ocorre porque a biblioteca nativa `sigar-amd64-winnt.dll` original truncava ponteiros de memória de 64 bits em sistemas Windows modernos com *High-Entropy ASLR*.

#### Solução aplicada
1. Acesse a pasta `C:\apache-jmeter-5.6.3\ServerAgent-2.2.3\lib`.
2. Faça um backup da DLL original, renomeando-a para `backup-sigar-amd64-winnt.dll`.
3. Baixe a versão corrigida para 64 bits da biblioteca `sigar-amd64-winnt.dll`:
   - Repositório de referência: [https://github.com/cnstar9988/sigar/blob/master/sigar-amd64-winnt.dll](https://github.com/cnstar9988/sigar/blob/master/sigar-amd64-winnt.dll)
4. Coloque o arquivo baixado dentro de `ServerAgent-2.2.3\lib` mantendo o nome **`sigar-amd64-winnt.dll`**.
5. Reinicie o ServerAgent executando `startAgent.bat`.

Após a substituição, o ServerAgent permanece estável e envia normalmente as métricas de **CPU**, **Memory**, **Disks I/O** e **Network I/O** para o gráfico do JMeter.

---

## 💡 Boas Práticas em Testes com JMeter

1. **Sempre execute testes de carga via CLI**: O modo GUI consome muita memória RAM e processamento gráfico, o que distorce a latência real medida.
2. **Desative Listeners pesados em produção**: Componentes visuais como *View Results Tree* gravam todas as respostas na memória, podendo causar esgotamento de memória (*OutOfMemoryError*).
3. **Ajuste o Heap Size da JVM**: Para testes com grande volume de conexões, ajuste a alocação de memória no arquivo `jmeter.bat` (Windows) ou `jmeter.sh` (Linux):
   ```bash
   set HEAP=-Xms2g -Xmx4g -XX:MaxMetaspaceSize=512m
   ```
4. **Use asserções com sabedoria**: Asserções de HTML e respostas completas adicionam sobrecarga de CPU na máquina geradora de carga. Ative-as principalmente na fase de validação e testes funcionais.
5. **Parametrize dados sensíveis**: Utilize variáveis definidas pelo usuário (`User Defined Variables`) ou arquivos CSV para credenciais, URLs base e portas, facilitando a troca entre ambientes (Dev, Homologação, Produção).
6. **Mantenha o repositório Git limpo**: Versione apenas planos de teste (`plans/*.jmx`) e massas de dados (`data/*.csv`). Artefatos pesados gerados a cada bateria (`results/*.jtl` e dashboards em `reports/`) devem ser ignorados via `.gitignore`, mantendo apenas a estrutura das pastas com arquivos `.gitkeep`.

---

## 🛠️ Tecnologias Utilizadas

- **Apache JMeter 5.6.3**
- **JMeter Plugins Manager & PerfMon ServerAgent 2.2.3**
- **Java JDK (Azul Zulu OpenJDK 25.0.4.1 LTS & Eclipse Adoptium OpenJDK 8)**
- **HTML5 & CSS3** (para relatórios do Dashboard SB Admin 2)
- **JSON** (para armazenamento e exportação de estatísticas)
- **Git** para versionamento de código e planos de teste

---

## 🎓 Cursos e Certificações

Os scripts e projetos deste repositório foram construídos e estruturados com base nos treinamentos:

| Curso / Formação | Instrutor / Instituição | Status / Certificado | Pasta do Projeto |
| :--- | :--- | :--- | :--- |
| **[Aprenda JMeter em 1 Hora - Iniciante](https://www.udemy.com/course/aprenda-jmeter-em-1-hora-iniciante/)** | Escola de Devs Oficial - Udemy | 🏆 **Concluído** (11/10/2026)<br>[Visualizar Certificado Udemy](https://www.udemy.com/certificate/UC-a941ad41-86d3-4976-aec2-e86bc68ad3e4/) | [`aprenda_jmeter_em_1_hora_iniciante/`](aprenda_jmeter_em_1_hora_iniciante/) |
| **[JMeter: Teste de Performance de Aplicações Web](https://www.udemy.com/course/jmeter-teste-de-performance-de-aplicacoes-web/)** | Leonardo Baraúna - Udemy | 🏆 **Concluído** (02/11/2026)<br>[Visualizar Certificado Udemy](https://www.udemy.com/certificate/UC-26a2a547-b72e-419c-9167-676510f2c1f3/) | [`jmeter_teste_de_performance_de_aplicacoes_web/`](jmeter_teste_de_performance_de_aplicacoes_web/) |

---

## 👩‍💻 Autoria

Desenvolvido por **Sthefany Albuquerque Ricardo** para fins de estudo, prática e aprimoramento profissional em **Engenharia de Qualidade de Software (QA)** e **Testes de Performance / Desempenho / Carga**.
