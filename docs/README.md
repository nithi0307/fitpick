# FitPick — Documentation

| File | Contents |
|---|---|
| [FitPick-Project-Report.pdf](FitPick-Project-Report.pdf) | Problem statement, user stories, system architecture and design, design of tests, and the appendices (SRS, DFD, ERD, UML, code listing) |
| [FitPick-Testing-and-Build-Report.pdf](FitPick-Testing-and-Build-Report.pdf) | Integration, regression and mutation testing; version management; system building; screenshots of every screen; tools and technologies |
| [design/FitPick-Software-Design-Document.pdf](design/FitPick-Software-Design-Document.pdf) | Software design document (design principles, architecture, UI, design decisions) |

```
docs/
├── FitPick-Project-Report.pdf              # and .docx source
├── FitPick-Testing-and-Build-Report.pdf     # and .docx source
├── design/
│   ├── architecture/        fitpick-architecture.drawio + .png
│   ├── diagrams/            dfd-level-0, dfd-level-1, erd, use-case,
│   │                        class-diagram, sequence-add-clothing  (.drawio + .png)
│   ├── wireframes/          the six screens as submitted with the design document
│   └── FitPick-Software-Design-Document.pdf
└── screenshots/
    ├── 01-login … 06-profile-analytics      application screens
    ├── T1 … T6                              test runs (integration, regression,
    │                                        unit, mutation before/after, full suite)
    └── V1 … V7                              git history, Docker, API, database,
                                             Swagger docs, GitHub repository and issues
```

All diagrams are editable: open any `.drawio` file at https://app.diagrams.net.
