# Contact Extractor

Paste several LinkedIn profile snippets and turn them into spreadsheet rows with **Name**, **Company**, **Email**, and **LinkedIn URL**. The tool understands snippets such as:

```text
**Xinwei’s profile**
[linkedin.com/in/xinwei-he-586512134](https://www.linkedin.com/in/xinwei-he-586512134/)
**Email**
**xinwei.he.swe\@gmail.com**
**Connected since**
Jan 5, 2026
```

Open `index.html` in a browser, paste your snippets, and click **Extract contacts**. Click **Copy for sheet**, then paste into cell A1 of Google Sheets or Excel. You can also download a CSV.

Company names are included when explicitly stated in the snippet or in a clear “at Company” headline. Missing companies remain blank. A LinkedIn profile URL can supply a fallback name when no name is written. Repeated contacts are removed.

Everything runs in your browser. There is no server, account, upload, or tracking.
