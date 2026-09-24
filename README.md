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

Open `index.html` in a browser, paste a profile or several snippets, and click **Add contacts**. The paste box clears, and the new contacts are added below your existing rows. Repeat for more profiles; duplicates are skipped. Edit any result cell, add or remove rows, then click **Copy for sheet** and paste into cell A1 of Google Sheets or Excel. **Download CSV** uses the edited values. Your draft auto-saves in this browser so you can return later on the same browser and site.

Company names are included when explicitly stated in the snippet or in a clear “at Company” headline. Missing companies remain blank. A LinkedIn profile URL can supply a fallback name when no name is written. Repeated contacts are removed.

Everything runs in your browser. Nothing is uploaded to a server. The pasted text and edited rows are stored in this browser’s local storage until you use **Clear all** (or clear the site’s browser data).
