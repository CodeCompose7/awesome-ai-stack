"""LanceDB: an embedded vector database — no server, data on local disk.

Creates a small table of vectors, runs a nearest-neighbour search, and prints
the closest row. Fully local and deterministic: no API key, no network.

Run:
    docker build -t aas-lancedb .
    docker run --rm aas-lancedb
"""

import lancedb


def main() -> None:
    db = lancedb.connect("/tmp/lance-demo")  # embedded; a local directory
    db.drop_table("docs", ignore_missing=True)
    tbl = db.create_table(
        "docs",
        data=[
            {"vector": [0.1, 0.2, 0.3, 0.4], "text": "Cats are independent pets that purr."},
            {"vector": [0.9, 0.8, 0.7, 0.6], "text": "A rocket is propelled by ejecting exhaust."},
        ],
    )

    hits = tbl.search([0.12, 0.21, 0.29, 0.41]).limit(1).to_list()
    print("nearest:", hits[0]["text"])


if __name__ == "__main__":
    main()
