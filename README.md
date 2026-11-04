# The Movie Review Project

This is a data labeing interface for classifying the sentiment of movie reviews using the [IMDB movie review dataset](https://ai.stanford.edu/~amaas/data/sentiment/) (Maas et al., 2011), built for assignment A3-1. This is the version of the interface without AI assistance.

**Interface URL:** [https://gellerjuliaa.github.io/sentiment-labeling-interface/](https://gellerjuliaa.github.io/sentiment-labeling-interface/)

## For graders

1. Open the live link above.
2. Click the ticket to open the intro, then **Get started** on the welcome letter.
3. Enter any uniqname and continue.
4. Read through the short tutorial (**Next** through each step), covering what to judge, what can be misleading, an example review, and the attention checks.
5. Do the two practice reviews (**Check answer** shows the right answer), then click **Start the study**.
6. Label 5 real reviews and 2 attention checks, one at a time, by picking **Positive** or **Negative**, rating your confidence from 1 to 5, and clicking **Next review**.
7. After the last one, the end screen shows your answers and confirms they were saved, with buttons to **Label 5 more** or **Download my responses**.
8. To see the record of what was annotated, click Download my responses on the end screen. The CSV has one row per annotated review (i.e. uniqname, review ID, label, confidence).


## File Structure

- `index.html`: the app itself (HTML + CSS + JS). The study settings and all the text participants see are at the top of the file.
- `reviews.json`: the cleaned movie reviews. 
- `make_reviews_json.py`: the script that cleans the movie reviews from the study dataset and saves it as `reviews.json`.
- `imdb_study_dataset_Julia_Geller.csv`: the study dataset from assignment 2.
- `apps_script.gs`: the Google Apps Script backend that saves responses to a Google Sheet.

## The dataset

`reviews.json` holds the 200 reviews from my assignment 2 study dataset (`imdb_study_dataset_Julia_Geller.csv`), a random sample from the `train` split of the IMDB dataset with 96 positive and 104 negative reviews. It was made by running:

```
python make_reviews_json.py imdb_study_dataset_Julia_Geller.csv
```

> Maas, A. L., Daly, R. E., Pham, P. T., Huang, D., Ng, A. Y., & Potts, C. (2011). Learning Word Vectors for Sentiment Analysis. *Proceedings of ACL 2011*, 142–150.