We are starting a new self-contained piece of work: add the ADRs to the frontend (in the lab), as a documentation of the "making-off" of the portfolio app.                                                                    
Two strands to look at
1. generate a surface proposal with /impeccable for the feature, reusing the design system in place, Constraints:
- ADRs could count in the 100s so index MUST be suitable for long list. Consider pagination, search and filtering (ADR have keywords)
- Insights are top-level valuable experience, possibly linked to ADR(s). Consider how to convey they highler level of knowledge                                                                                                  
2. Once a surface has been designed and approved, get an API for retrieving both ADRs and INSIGHTs from the `.docs/` location, in a usable form for the UI. Constraints:
- the original `./docs/adr` and `./docs/insights` MUST NOT be modified, they are static documents
- the ADRs will be located within the labs (e.g. /lab/adr), along the design system
- references to ADRs and possible other elements of the application (e.g. design system) must be considered

Create a task for this job, update the tracker (be mindful that other tasks might be in progress in parallel) and start the process. Ask questions at any ambiguity or decision-making point

