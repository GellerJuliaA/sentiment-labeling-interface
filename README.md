# The Movie Review Project: study interface, no-AI condition (A3-1)

Participants read IMDb movie reviews and decide whether each reviewer liked the movie (Positive) or not (Negative). This is the baseline condition of the A3 study, with no AI assistance. It is adapted from the A1 emotion-labeling interface.

**Live task:** _add GitHub Pages link_  
**Researcher view:** the same link with `?researcher` added (shows a Data tab).

## For graders

1. Open the live link and click the ticket, then **Get started**.
2. Enter a uniqname and continue.
3. Read the 6-step tutorial, then do 2 practice reviews (each shows the right answer after you check it).
4. Label the reviews: choose Positive or Negative, rate confidence 1–5, click **Next review**. Two attention checks are mixed in. Every answer is sent to the Google Sheet backend as it's made; the done screen confirms the upload and offers **Label 5 more**.

## Study design

- **Trials.** Each participant gets `N_TRIALS` = 5 reviews drawn at random from the 200-review study dataset, so different participants see different reviews. A browser that has already been shown a review won't get it again, including across the two conditions when they're hosted on the same github.io domain, so anyone who happens to do both versions won't see a review twice. Session length is about 10 minutes; `make_reviews_json.py` prints estimates for other values of N.
- **Instructions and warm-up.** The tutorial first explains what to judge (the reviewer's own feelings about the movie after watching, with Positive and Negative defined), then the four things that commonly mislead: sad stories, opinions about characters, a few complaints, and plot summaries. These came out of the A2 error analysis. A worked example and two practice reviews with feedback follow.
- **Batches and resuming.** A batch is 5 reviews plus the attention checks. After a batch, participants can click **Label 5 more** to get a new random batch in the same session (same `session_id` and uniqname, no tutorial again). **Save & exit** saves progress, and Home in that browser offers **Resume**. A reload mid-review also resumes.
- **Attention checks.** Two instructed-response items ("choose Negative", "choose Positive") in every batch, one at random in each half. Missing one is recorded; missing both within a batch ends the session, and the participant can start over.
- **Additional measurement: confidence.** After each label, participants rate how sure they are (1–5). This shows whether AI assistance changes how confident people feel, and whether confidence tracks correctness, which matters for appropriate reliance on AI.

## What gets recorded

Only what the analysis needs. Each answer is one row in the Google Sheet's **trials** tab:

| Column | Meaning |
| --- | --- |
| `saved_time` | When the sheet received the row (added by the backend) |
| `uniqname` | Participant |
| `session_id` | One ID per person per browser session (separates repeat attempts) |
| `condition` | `no_ai` (or `ai` in the other version) |
| `batch_number` | 1 for the first 5 reviews, 2 after "Label 5 more", and so on |
| `item_type` | `review` or `attention_check` |
| `review_id` | Row number in the study CSV (`AC1`/`AC2` for attention checks) |
| `true_label` | Correct answer: 1 = positive, 0 = negative |
| `participant_label` | What the participant picked |
| `confidence` | 1 (guessing) to 5 (certain) |

**Attention checks.** They're saved in the same tab as the reviews, with `item_type` = `attention_check`. `review_id` says which check it was, and `true_label` holds its right answer:

| `review_id` | Text participants see | Right answer (`true_label`) |
| --- | --- | --- |
| `AC1` | "This is an attention check, not a movie review. To show you’re reading carefully, choose Negative, then any confidence level." | 0 (Negative) |
| `AC2` | "Quick attention check: this isn’t a real review. Please choose Positive, then any confidence level." | 1 (Positive) |

A check is passed when `participant_label` equals `true_label`.

Messages from the Give feedback tab go to a **feedback** tab (`uniqname`, `condition`, `feedback`).

**Analysis notes.** Correctness is `participant_label == true_label`. The AI's label for each review is in `reviews.json` / the study CSV, joined on `review_id`. Attention-check rows show who failed a check; anyone who missed both in one batch was stopped and restarted under a new `session_id`. Files participants download and email you leave out `true_label`; re-score them from `review_id`.

## Setup

**1. Build the dataset.** Put `imdb_study_dataset_Julia_Geller.csv` next to the script and run:

```
python make_reviews_json.py imdb_study_dataset_Julia_Geller.csv
```

This writes `reviews.json` (`id`, `text`, `label`, `ai_label`), and converts the reviews' `<br />` tags to line breaks.

**2. Set up the backend (Google Sheet + Apps Script).**

1. Create a Google Sheet, then open **Extensions → Apps Script**.
2. Replace the default code with `apps_script.gs` and save.
3. **Deploy → New deployment**, type **Web app**, execute as **Me**, access **Anyone**. Authorize it, then copy the web-app URL (ends in `/exec`).
4. Paste that URL into `CONFIG.ENDPOINT` near the top of the script in `index.html`.
5. Open the URL in a browser; it should say the backend is running. Do one test session and check the Sheet's `trials` tab.

If your umich Google account doesn't allow **Anyone** access, deploy from a personal Gmail account instead. After editing the script later, use **Manage deployments → Edit → New version**, or the URL keeps serving the old code.

**3. Deploy.** Push `index.html` and `reviews.json` together to GitHub Pages (for example, a `no-ai/` folder in a new repo, with the AI version later in `ai/` of the same repo). Opening `index.html` directly from disk won't work because the browser blocks loading `reviews.json`; to run it locally, use `python3 -m http.server` and open `http://localhost:8000`.

## Files

- `index.html`: the app (HTML, CSS, JS). Study settings are in `CONFIG`; all on-screen text is in `COPY`.
- `reviews.json`: the 200-review study dataset, generated by the script below.
- `make_reviews_json.py`: builds `reviews.json` from the A2 study CSV.
- `apps_script.gs`: the backend that writes records to the Google Sheet.

## Dataset

Maas, A. L., Daly, R. E., Pham, P. T., Huang, D., Ng, A. Y., & Potts, C. (2011). Learning Word Vectors for Sentiment Analysis. *Proceedings of ACL 2011*, 142–150.