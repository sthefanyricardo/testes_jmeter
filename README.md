# 🚀 Testes de Performance com Apache JMeter

Repositório dedicado ao estudo, desenvolvimento e execução de testes de desempenho, carga e estresse para aplicações web utilizando o **[Apache JMeter](https://jmeter.apache.org/)**.

---

## 📌 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Conceitos Praticados](#-conceitos-praticados)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar os Testes](#-como-executar-os-testes)
  - [1. Modo Gráfico (GUI - Criação e Depuração)](#1-modo-gráfico-gui---criação-e-depuração)
  - [2. Modo Linha de Comando (CLI / Non-GUI - Recomendado)](#2-modo-linha-de-comando-cli--non-gui---recomendado)
  - [3. Geração de Relatórios HTML (Dashboard)](#3-geração-de-relatórios-html-dashboard)
- [Boas Práticas em Testes com JMeter](#-boas-práticas-em-testes-com-jmeter)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Cursos e Certificações](#-cursos-e-certificações)
- [Autoria](#-autoria)

---

## 📖 Sobre o Projeto

Este repositório reúne planos de teste (`.jmx`), massa de dados (`.csv`), resultados de execução (`.jtl`) e relatórios visuais gerados durante cursos e práticas de automação de testes de performance.

Os cenários cobrem desde requisições HTTP básicas até configurações avançadas com validações de tempo de resposta, códigos de status, análise sintática de HTML, parametrização dinâmica de dados e gravação de fluxos de navegação.

---

## 📂 Estrutura do Repositório

```text
testes_jmeter/
├── aprenda_jmeter_em_1_hora_iniciante/
│   ├── dashboard_report_table/            # Relatório HTML gerado para a visualização em tabela
│   │   ├── index.html                     # Dashboard visual completo
│   │   └── statistics.json                # Métricas consolidadas em JSON
│   ├── dashboards_report_tree/            # Relatório HTML gerado para a visualização em árvore
│   ├── Materiais Curso JMeter/            # Arquivos complementares de estudo e apoio
│   │   ├── gitgithub.csv                  # Massa de dados para testes parametrizados (Data-Driven)
│   │   ├── gravacao-git.jmx               # Script gravado via HTTP(S) Test Script Recorder
│   │   ├── Test-plan.jmx                  # Plano de teste inicial
│   │   ├── test-plan-1.jmx                # Plano de teste com melhorias de assertions e listeners
│   │   ├── results-listeners-table-1.csv  # Log de resultados em formato CSV
│   │   └── testando-linha-de-comando.csv  # Resultados de execução via CLI
│   ├── report-html.txt                    # Saída da asserção de estrutura HTML (HTML Assertion)
│   ├── resultados-arvore.jtl              # Log de resultados gerado pelo View Results Tree
│   ├── resultados-graph.jtl               # Log de resultados gerado pelo Graph Results
│   ├── resultados-report.jtl              # Log de resultados gerado pelo Summary Report
│   ├── resultados-tabela.jtl              # Log de resultados gerado pelo View Results in Table
│   └── testes_curso_rapido_jmeter.jmx     # Plano de teste principal do curso para iniciantes
│
├── jmeter_teste_de_performance_de_aplicacoes_web/
│   └── Cursor - Requisição Google.jmx     # Plano com requisição HTTP simples e amostradores de resultados
│
└── README.md                              # Documentação geral do repositório
```

---

## 🎯 Conceitos Praticados

Durante as práticas implementadas neste repositório, foram explorados os principais componentes do ecossistema do JMeter:

| Componente | Função |
| :--- | :--- |
| **Thread Group** | Simulação da quantidade de usuários virtuais concorrentes, tempo de subida (*ramp-up*) e ciclos de iteração (*loops*). |
| **HTTP Request Sampler** | Envio de requisições HTTP/HTTPS (GET, POST, etc.) parametrizando domínios, caminhos e portas. |
| **Response Assertion** | Validação automatizada de regras, como validação de código de status HTTP (`200 OK`) e conteúdos esperados. |
| **Duration Assertion** | Verificação de conformidade de SLA (ex.: requisição deve responder em menos de $X$ ms). |
| **HTML Assertion** | Verificação da integridade do código HTML retornado na resposta, apontando erros e avisos de sintaxe. |
| **CSV Data Set Config** | Execução de testes baseados em dados (*Data-Driven Testing*), lendo listas dinâmicas de parâmetros de arquivos `.csv`. |
| **HTTP(S) Test Script Recorder** | Captura e gravação de requisições de navegação do usuário através de proxy intermediário. |
| **Listeners & Relatórios** | Coleta de métricas como Throughput, Latência, Tempo de Conexão, Percentis (90%, 95%, 99%) e Códigos de Erro. |

---

## ⚙️ Pré-requisitos

Para abrir e executar os testes deste repositório, você precisará de:

1. **Java JDK 8 ou superior** (Ambiente local configurado com **[Azul Zulu OpenJDK 25 LTS](https://www.azul.com/downloads/?os=windows&package=jdk#zulu)**):
   - **Versão:** Azul Zulu OpenJDK `25.0.4.1` (x64)
   - **Caminho de instalação:** `C:\Program Files\Java\zulu25.36.205-ca-jdk25.0.4.1-win_x64`
   - **Variável de Ambiente:**
     - `JAVA_HOME`: `C:\Program Files\Java\zulu25.36.205-ca-jdk25.0.4.1-win_x64`
     - `PATH`: `%JAVA_HOME%\bin`
   - Verificação no terminal:
     ```bash
     java -version
     ```

2. **Apache JMeter 5.6.X** ([Download oficial](https://jmeter.apache.org/download_jmeter.cgi)):
   - **Versão:** `5.6.3`
   - **Caminho de instalação:** `C:\apache-jmeter-5.6.3`
   - **Executável GUI:** `C:\apache-jmeter-5.6.3\bin\jmeter.bat`
   - **Variável de Ambiente (Opcional):**
     - `JMETER_HOME`: `C:\apache-jmeter-5.6.3`
     - `PATH`: `%JMETER_HOME%\bin` *(permite rodar o comando `jmeter` diretamente no terminal)*

---

## 🚀 Como Executar os Testes

### 1. Modo Gráfico (GUI - Criação e Depuração)

> ⚠️ **Atenção:** Utilize a interface gráfica **somente** para construir, editar ou validar os scripts. Não execute testes de carga pesada pela interface gráfica.

#### Opção A: Executando o arquivo `.bat` diretamente (Padrão no Windows)
1. Navegue até a pasta:
   ```text
   C:\apache-jmeter-5.6.3\bin
   ```
2. Dê dois cliques no arquivo **`jmeter.bat`** (ou execute `C:\apache-jmeter-5.6.3\bin\jmeter.bat` no CMD/PowerShell).
3. Uma janela do Prompt de Comando preta abrirá com os avisos e logs da inicialização do JMeter:
   > ℹ️ **Importante:** Não feche essa janela do terminal preta enquanto estiver usando o JMeter, pois ela sustenta o processo em execução.
4. Logo em seguida, a interface gráfica do JMeter (5.6.3) será aberta.
5. No menu superior do JMeter, vá em **File > Open** (`Ctrl + O`).
6. Navegue até o workspace e selecione o plano de teste desejado:
   - Exemplo 1: `jmeter_teste_de_performance_de_aplicacoes_web/Cursor - Requisição Google.jmx`
   - Exemplo 2: `aprenda_jmeter_em_1_hora_iniciante/testes_curso_rapido_jmeter.jmx`
7. Clique no botão verde de **Play** (ou pressione `Ctrl + R`) para iniciar.
8. Acompanhe os resultados nos ouvintes configurados (**View Results Tree**, **View Results in Table**, etc.).

#### Opção B: Via Terminal (caso `C:\apache-jmeter-5.6.3\bin` esteja no `PATH`)
Se você adicionou o diretório `bin` ao `PATH`, basta abrir o terminal e digitar:
```bash
jmeter
```

---

### 2. Modo Linha de Comando (CLI / Non-GUI - Recomendado para Carga Real)

Para simulações de carga reais e coletas de métricas precisas, execute o JMeter em modo *headless* (sem interface gráfica):

```bash
# Se o JMeter estiver no PATH:
jmeter -n -t "aprenda_jmeter_em_1_hora_iniciante/testes_curso_rapido_jmeter.jmx" -l "resultado_execucao.jtl"

# Ou utilizando o caminho absoluto do .bat:
"C:\apache-jmeter-5.6.3\bin\jmeter.bat" -n -t "aprenda_jmeter_em_1_hora_iniciante/testes_curso_rapido_jmeter.jmx" -l "resultado_execucao.jtl"
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
jmeter -n -t "aprenda_jmeter_em_1_hora_iniciante/testes_curso_rapido_jmeter.jmx" -l "resultado.jtl" -e -o "dashboard_output"
# Ou:
"C:\apache-jmeter-5.6.3\bin\jmeter.bat" -n -t "aprenda_jmeter_em_1_hora_iniciante/testes_curso_rapido_jmeter.jmx" -l "resultado.jtl" -e -o "dashboard_output"
```

#### B) Gerar o relatório a partir de um arquivo `.jtl` já existente:
```bash
jmeter -g "aprenda_jmeter_em_1_hora_iniciante/resultados-tabela.jtl" -o "aprenda_jmeter_em_1_hora_iniciante/meu_novo_dashboard"
# Ou:
"C:\apache-jmeter-5.6.3\bin\jmeter.bat" -g "aprenda_jmeter_em_1_hora_iniciante/resultados-tabela.jtl" -o "aprenda_jmeter_em_1_hora_iniciante/meu_novo_dashboard"
```

Após o término, basta abrir o arquivo `index.html` gerado na pasta de saída em qualquer navegador web.

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

---

## 🛠️ Tecnologias Utilizadas

- **Apache JMeter 5.6.3**
- **Java JDK (Azul Zulu OpenJDK 25.0.4.1 LTS)**
- **HTML5 & CSS3** (para relatórios do Dashboard SB Admin 2)
- **JSON** (para armazenamento e exportação de estatísticas)
- **Git** para versionamento de código e planos de teste

---

## 🎓 Cursos e Certificações

Os scripts e projetos deste repositório foram construídos e estruturados com base nos treinamentos:

| Curso / Formação | Instrutor / Instituição | Status / Certificado | Pasta do Projeto |
| :--- | :--- | :--- | :--- |
| **[Aprenda JMeter em 1 Hora - Iniciante](https://www.udemy.com/course/aprenda-jmeter-em-1-hora-iniciante/)** | Escola de Devs Oficial | 🏆 **Concluído** (11/10/2026)<br>[Visualizar Certificado Udemy](https://www.udemy.com/certificate/UC-a941ad41-86d3-4976-aec2-e86bc68ad3e4/) | [`aprenda_jmeter_em_1_hora_iniciante/`](aprenda_jmeter_em_1_hora_iniciante/) |
| **[JMeter: Teste de Performance de Aplicações Web](https://www.udemy.com/course/jmeter-teste-de-performance-de-aplicacoes-web/)** | Udemy | 📖 **Em andamento** / Práticas Contínuas | [`jmeter_teste_de_performance_de_aplicacoes_web/`](jmeter_teste_de_performance_de_aplicacoes_web/) |

---

## 👩‍💻 Autoria

Desenvolvido por **Sthefany Albuquerque Ricardo** para fins de estudo, prática e aprimoramento profissional em **Engenharia de Qualidade de Software (QA)** e **Testes de Desempenho / Carga**.
