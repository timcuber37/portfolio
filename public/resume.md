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
      {Master of Science in Computer Science}{Jan. 2026 -- Dec. 2027}

    \resumeSubheading
    {Southern Connecticut State University}{New Haven, CT}
    {Bachelor of Science in Computer Science, Minor in Mathematics}{Jan. 2024 -- Dec. 2025}

    \resumeSubheading
      {Rensselaer Polytechnic Institute}{Troy, NY}
      {}{Aug. 2020 -- Dec. 2023}
  \resumeSubHeadingListEnd


%-----------WORK EXPERIENCE-----------
\section{Work Experience}
  \resumeSubHeadingListStart

    \resumeSubheading
      {AV/TV Technician}{Apr. 2026 -- Present}
      {Southern Connecticut State University}{New Haven, CT}
      \resumeItemListStart
        \resumeItem{Diagnosed and resolved 5--10 daily AV service tickets, troubleshooting projectors, speakers, and control systems.}
        \resumeItem{Collaborated with IT staff on AV infrastructure troubleshooting, reducing repeat incidents.}
      \resumeItemListEnd

    \resumeSubheading
      {Information Technology Intern}{May 2023 -- Aug. 2023}
      {Connex Credit Union}{North Haven, CT}
      \resumeItemListStart
        \resumeItem{Supported a core-system migration by cataloging database entries, validating data integrity, and cleaning up records for accurate post-conversion data.}
        \resumeItem{Resolved 5--10 daily helpdesk tickets across hardware, software, and network issues for 100+ employees over 6 branches.}
        \resumeItem{Imaged and deployed 50+ workstations using Acronis across office desktops and laptops.}
      \resumeItemListEnd

  \resumeSubHeadingListEnd


%-----------PROJECTS-----------
\section{Projects}
    \resumeSubHeadingListStart

    \resumeProjectHeading
          {\textbf{\href{https://speedcubemuse.fly.dev/}{SpeedCubeMuse}} $|$ \emph{Python, Flask, Claude, pgvector, TiDB, Docker, Fly.io}}{Jan. 2026 -- Pres.}
          \resumeItemListStart
            \resumeItem{Built an AI-powered natural-language-to-SQL interface over a 6.3M+ row WCA competition database, using Claude to translate plain-English questions into validated, read-only SQL for non-technical users.}
            \resumeItem{Developed a Retrieval-Augmented Generation chatbot for WCA regulations with Voyage AI embeddings, pgvector similarity search, and a reranker over 697 regulations, returning grounded answers with citations.}
            \resumeItem{Automated database maintenance into a single command via a Python pipeline that pulls the WCA export API and bulk-loads multi-GB data into TiDB Serverless, backed by an 89-test pytest suite for data integrity.}
            \resumeItem{Hardened the app with a strict CSP, per-endpoint rate limiting, and non-SELECT query rejection; deployed a multi-process Docker container (web app + Discord bot) to Fly.io via a GitHub Actions CI/CD pipeline.}
          \resumeItemListEnd

      \resumeProjectHeading
          {\textbf{\href{https://github.com/timcuber37/poke-collect}{Poke-Collect}} $|$ \emph{Python, Flask, Kafka, Cassandra, PostgreSQL, MySQL}}{Mar. 2026 -- Pres.}
          \resumeItemListStart
            \resumeItem{Built a Pokémon TCG collection manager on a CQRS architecture with Python/Flask --- MySQL for writes, Apache Cassandra for read models, PostgreSQL + pgvector for vector search, and Apache Kafka as the event bus.}
            \resumeItem{Engineered event-driven Kafka consumers that project write-side events into denormalized Cassandra read models, enabling JOIN-free queries across 4 cooperating distributed processes.}
            \resumeItem{Implemented a rate-limit-aware sync (146 sets from the PokéWallet API with idempotent upserts under a 100 req/hr budget) and lazy TCGPlayer price enrichment surfacing per-card and total portfolio value.}
          \resumeItemListEnd

      \resumeProjectHeading
          {\textbf{\href{https://github.com/timcuber37/portfolio}{Developer Portfolio}} $|$ \emph{Next.js, React, TypeScript, Prisma, Turso, Claude}}{May 2026 -- Pres.}
          \resumeItemListStart
            \resumeItem{Built a full-stack portfolio and session-authenticated headless CMS with Next.js 16, React 19, and TypeScript, deployed on Vercel with a Turso (libSQL) database via the Prisma driver adapter.}
            \resumeItem{Integrated the Anthropic Claude API to auto-draft project entries from GitHub READMEs and rewrite content from natural-language instructions, using prompt caching and adaptive thinking.}
            \resumeItem{Built a custom visitor-analytics pipeline (page views, downloads, messages) with geo detection in a Recharts dashboard, plus admin CRUD over all site content with no redeploys.}
          \resumeItemListEnd

    \resumeSubHeadingListEnd


%-----------SKILLS-----------
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: Python, TypeScript, JavaScript, SQL, C/C++, Java} \\
     \textbf{Frameworks \& Tools}{: React, Next.js, Flask, Node, Docker, Kafka, Git} \\
     \textbf{Data \& Cloud}{: PostgreSQL, MySQL, Cassandra, TiDB, AWS, Fly.io, Vercel}
    }}
 \end{itemize}

\end{document}
