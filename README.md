# The Movie Review Project: study interface, no-AI condition (A3-1)

Participants read IMDb movie reviews and decide whether each reviewer liked the movie (Positive) or not (Negative). This is the baseline condition of the A3 study, with no AI assistance. It is adapted from the A1 emotion-labeling interface.

**Live task:** _add GitHub Pages link_  
**Researcher view:** the same link with `?researcher` added (shows a Data tab).

## For graders

1. Open the live link and click the ticket, then **Get started**.
2. Enter a uniqname and continue.
3. Read the 6-step tutorial, then do 2 practice reviews (each shows the right answer after you check it).
4. Label the reviews: choose Positive or Negative, rate confidence 1–5, click **Next review**. Two attention checks are mixed in. Every answer is sent to the Google Sheet backend as it's made; the done screen confirms the upload.

## Study design

- **Trials.** Each participant gets `N_TRIALS` = 5 reviews drawn at random from the 200-review study dataset, so different participants see different reviews. A browser that has already been shown a review won't get it again, including across the two conditions when they're hosted on the same github.io domain, so anyone who happens to do both versions won't see a review twice. Session length is about 10 minutes; `make_reviews_json.py` prints estimates for other values of N.
- **Instructions and warm-up.** The tutorial first explains what to judge (the reviewer's own feelings about the movie after watching, with Positive and Negative defined), then the four things that commonly mislead: sad stories, opinions about characters, a few complaints, and plot summaries. These came out of the A2 error analysis. A worked example and two practice reviews with feedback follow.
- **Attention checks.** Two instructed-response items ("choose Negative", "choose Positive"), one placed at random in each half of the session. Missing one is recorded; missing both ends the session, and the participant can start over.
- **Additional measurement: confidence.** After each label, participants rate how sure they are (1–5). This shows whether AI assistance changes how confident people feel, and whether confidence tracks correctness, which matters for appropriate reliance on AI. Time per review (`activeMs`, excluding time the tab was hidden) is also logged automatically, with nothing extra asked of participants.

## What gets recorded

Records go to three tabs of the Google Sheet (and are mirrored in the participant's browser as a backup):

- **trials**: one row per review or attention check. `participant` (uniqname), `sessionId`, `condition`, `trialIndex`, `itemType`, `reviewId` (row number in the study CSV), `reviewWords`, `goldLabel`, `chosenLabel`, `correct`, `confidence`, `rtMs`, `activeMs`, `hiddenMs`, `msToFirstLabel`, `labelChanges`, `baselineAiLabel` (SmolLM2's A2 label, never shown in this condition), timestamps.
- **sessions**: a row when the reviews start (`status = started`) and another when the session ends (`complete`, `terminated`, or `exited`), with accuracy, mean confidence, mean time per review, attention-check fails, practice score, and durations.
- **feedback**: anything sent from the Give feedback tab.

Labels use the dataset's coding: 1 = positive, 0 = negative.

**Analysis notes.** Drop duplicate `recordId`s (a retried upload can arrive twice). Use each `sessionId`'s last session row, and keep only `complete` sessions with fewer than 2 attention fails. If someone completed more than once, keep their first complete session.

## Setup

**1. Build the dataset.** Put `imdb_study_dataset_Julia_Geller.csv` next to the script and run:

```
python make_reviews_json.py imdb_study_dataset_Julia_Geller.csv
```

This writes `reviews.json` (`id`, `text`, `label`, `ai_label`), converts the reviews' `<br />` tags to line breaks, and prints review lengths and time estimates.

**2. Set up the backend (Google Sheet + Apps Script).**

1. Create a Google Sheet, then open **Extensions → Apps Script**.
2. Replace the default code with `apps_script.gs` and save.
3. **Deploy → New deployment**, type **Web app**, execute as **Me**, access **Anyone**. Authorize it, then copy the web-app URL (ends in `/exec`).
4. Paste that URL into `CONFIG.ENDPOINT` near the top of the script in `index.html`.
5. Open the URL in a browser; it should say the backend is running. Do one test session and check the Sheet's `trials` and `sessions` tabs.

If your umich Google account doesn't allow **Anyone** access, deploy from a personal Gmail account instead. After editing the script later, use **Manage deployments → Edit → New version**, or the URL keeps serving the old code.

**3. Deploy.** Push `index.html` and `reviews.json` together to GitHub Pages (for example, a `no-ai/` folder in a new repo, with the AI version later in `ai/` of the same repo). Opening `index.html` directly from disk won't work because the browser blocks loading `reviews.json`; to run it locally, use `python3 -m http.server` and open `http://localhost:8000`.

## Files

- `index.html`: the app (HTML, CSS, JS). Study settings are in `CONFIG`; all on-screen text is in `COPY`.
- `reviews.json`: the 200-review study dataset, generated by the script below.
- `make_reviews_json.py`: builds `reviews.json` from the A2 study CSV.
- `apps_script.gs`: the backend that writes records to the Google Sheet.

## Dataset

Maas, A. L., Daly, R. E., Pham, P. T., Huang, D., Ng, A. Y., & Potts, C. (2011). Learning Word Vectors for Sentiment Analysis. *Proceedings of ACL 2011*, 142–150.
