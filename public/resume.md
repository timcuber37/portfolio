%-------------------------
% Resume in Latex
% Author : Timothy Yang
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}


\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\begin{document}

%----------HEADING----------
% \begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
%   \textbf{\href{http://sourabhbajaj.com/}{\Large Sourabh Bajaj}} & Email : \href{mailto:sourabh@sourabhbajaj.com}{sourabh@sourabhbajaj.com}\\
%   \href{http://sourabhbajaj.com/}{http://www.sourabhbajaj.com} & Mobile : +1-123-456-7890 \\
% \end{tabular*}

\begin{center}
    \textbf{\Huge \scshape Timothy Yang} \\ \vspace{1pt}
    \small 475-238-2704 $|$ \href{mailto:timcuber37@gmail.com}{timcuber37@gmail.com} $|$ 
    \href{https://linkedin.com/in/timyang37}{linkedin.com/in/timyang37} $|$
    \href{https://github.com/timcuber37}{github.com/timcuber37}
\end{center}


%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Southern Connecticut State University}{New Haven, CT}
      {Master of Science in Computer Science}{Jan. 2026 - Dec. 2027}
    
      
    \resumeSubheading
    {Southern Connecticut State University}{New Haven, CT}
    {Bachelor of Science in Computer Science, Minor in Mathematics}{Jan. 2024 - Dec. 2025}
    % \resumeSubItem{GPA: 3.47}
    % \resumeSubItem{Coursework: Data Structures, Database Systems, Algorithms, Software Design/Development, Artificial Intelligence, Operating Systems, Programming Languages, Deep Learning, Distrib/Parallel Computing}
      
    \resumeSubheading
      {Rensselaer Polytechnic Institute}{Troy, NY}
      {}{Aug. 2020 -- Dec 2023}
  \resumeSubHeadingListEnd


%-----------WORK EXPERIENCE-----------
\section{Work Experience}
  \resumeSubHeadingListStart

    \resumeSubheading
      {AV/TV Technician}{Apr. 2026 -- Present}
      {Southern Connecticut State University}{New Haven, CT}
      \resumeItemListStart
        \resumeItem{Diagnosed and resolved 5--10 daily AV service tickets, troubleshooting projectors, speakers, and control systems.}
        \resumeItem{Collaborated with IT staff to coordinate AV infrastructure troubleshooting, reducing repeat incidents.}
      \resumeItemListEnd

    \resumeSubheading
      {Information Technology Intern}{May 2023 -- Aug. 2023}
      {Connex Credit Union}{North Haven, CT}
      \resumeItemListStart
        \resumeItem{Supported core system migration by cataloging database entries, validating data integrity, and assisting with data cleanup to ensure accurate records post-conversion.}
        \resumeItem{Provided helpdesk support resolving 5-10 tickets daily across various hardware, software, and network issues.}
        \resumeItem{Collaborated with 5-person IT team to resolve technical issues across 6 branches, supporting 100+ employees.}
        \resumeItem{Imaged and deployed 50+ workstations using Acronis across a variety of office desktop towers and laptops.}
        
    \resumeItemListEnd

    

  \resumeSubHeadingListEnd


%-----------PROJECTS-----------
\section{Projects}
    \resumeSubHeadingListStart
    \resumeProjectHeading
          {\textbf{\href{https://speedcubemuse.fly.dev/}{SpeedCubeMuse}} $|$ \emph{Python, Flask, Claude, TiDB Serverless, Supabase, Docker, Fly.io}}{Jan. 2026 - Pres.}
          \resumeItemListStart
            \resumeItem{Designed and queried a 6.3M+ row relational database schema, building an AI-powered NL-to-SQL pipeline to enable ad hoc reporting and data access for non-technical users.}
            \resumeItem{Architected a hybrid cloud data warehouse using TiDB Serverless for 1.68GB of WCA competition data and Supabase PostgreSQL, designing schema and data models optimized for analytical query performance.}
            \resumeItem{Enforced database security through Row Level Security policies and JWT-authenticated clients, ensuring proper access controls and data integrity across multi-user environments.}
            \resumeItem{Developed Python ETL scripts to automate extraction, transformation, and loading of external WCA competition data into the structured database schema on a recurring basis.}
            
          \resumeItemListEnd
      \resumeProjectHeading
          {\textbf{\href{https://github.com/timcuber37/poke-collect}{Poke-Collect}} $|$ \emph{Python, Flask, MySQL, Cassandra, PostgreSQL, Kafka, Ollama, PokeWallet}}{Mar. 2026 - Pres.}
          \resumeItemListStart
            \resumeItem{Built a Pokémon TCG collection manager on a CQRS architecture using Python/Flask, MySQL (writes), Apache Cassandra (read models), PostgreSQL + pgvector (vector search), and Apache Kafka as the event bus}
            \resumeItem{Implemented a RAG chatbot over 10,000+ cards using sentence-transformers embeddings, pgvector cosine-similarity retrieval, and a locally-hosted Ollama (phi3:mini) LLM for natural-language card Q\&A.}         
            \resumeItem{Engineered a rate-limit-aware sync service pulling 146 Pokémon TCG sets from the PokéWallet REST API, writing idempotent upserts to Cassandra and PostgreSQL within a 100 req/hour budget.}
            \resumeItem{Built event-driven Kafka consumers projecting write-side events into denormalized Cassandra read models, enabling JOIN-free collection queries across 4 cooperating distributed Python processes.}
            \resumeItem{Designed lazy TCGPlayer price enrichment that fetches live prices on collection add and caches them via COALESCE upserts, surfacing per-card and total portfolio value in the Jinja2 UI.}
            \resumeItem{Hardened a public Ollama chat endpoint against prompt injection with route-level input caps, structured delimiters, and a restrictive system prompt blocking SQL/schema discussion.}
            
          \resumeItemListEnd
      
    \resumeSubHeadingListEnd



%
%-----------SKILLS-----------
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: MySQL, PostgreSQL, Python, Java, C/C++, TypeScript, JavaScript, HTML/CSS, Haskell} \\
     \textbf{Developer Tools}{: Git/GitHub, TiDB, Supabase, Docker, AWS, GCP, Fly.io, Visual Studio} \\
     \textbf{Libraries \& Frameworks}{: React, Node, Flask, npm, Vite, NumPy, Sklearn, Matplotlib, TensorFlow, Asyncio} \\
     \textbf{Practices}{: SQL/Database Design, Data Modeling, Documentation, Agile/Scrum, Object-Oriented Design}
    }}
 \end{itemize}

\end{document}
