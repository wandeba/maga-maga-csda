import csv
import json
import os

os.makedirs("src/data", exist_ok=True)
hymns = []

with open("data/hymns_raw.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if not row or len(row) < 3:
            continue
        try:
            song_id = int(row[0].strip())
            title = row[1].strip()
            lyrics = row[2].strip()
            author = row[3].strip() if len(row) > 3 else ""
            favorites = row[4].strip() if len(row) > 4 else ""
            reference = row[5].strip() if len(row) > 5 else ""
            language = "Juba Arabic" if 1 <= song_id <= 360 else ("English" if song_id > 360 else "Preface")
            
            lyrics_lower = (title + " " + lyrics + " " + reference).lower()
            category = "General"
            if song_id == 0:
                category = "Acknowledgement"
            elif any(w in lyrics_lower for w in ["sabbath", "sebit", "sabato", "sabata", "mukadasa", "jehovah", "holy day"]):
                category = "Sabbath (Sebit)"
            elif any(w in lyrics_lower for w in ["raja", "yeji", "coming", "reign", "return", "second coming", "roll is called", "soon and very soon", "lift up the trumpet"]):
                category = "Second Coming (Maji al-Messiah)"
            elif any(w in lyrics_lower for w in ["seli", "prayer", "pray", "whisper a prayer", "incline thine ear", "hear our prayer"]):
                category = "Prayer & Worship (Salaa)"
            elif any(w in lyrics_lower for w in ["seliib", "cross", "calvary", "gologota", "blood", "damana", "fountain"]):
                category = "The Cross & Redemption (Seliib)"
            elif any(w in lyrics_lower for w in ["shukuru", "shukuran", "praise", "glory", "thanks", "mejid", "halleluya", "baraka"]):
                category = "Praise & Thanksgiving (Shukuran)"
            elif any(w in lyrics_lower for w in ["shabaab", "youth", "ays", "ambassador", "iyali", "children", "marching"]):
                category = "Youth & Mission (Shabaab)"
            elif any(w in lyrics_lower for w in ["samaa", "heaven", "zion", "jerusalem", "promised land", "mansion"]):
                category = "Heaven & Hope (Samaa)"
            elif any(w in lyrics_lower for w in ["doxology", "benediction", "dismiss us", "blessings flow", "holy, holy"]):
                category = "Doxology & Service (Kenisa)"

            # Musical key detection from reference if present (e.g. "E Maj", "F# Maj")
            key_signature = ""
            for possible_key in ["F# Maj", "Eb Maj", "Gb Maj", "Bb Maj", "Db Maj", "Ab Maj", "C Maj", "D Maj", "E Maj", "F Maj", "G Maj", "A Maj", "B Maj"]:
                if possible_key.lower() in reference.lower():
                    key_signature = possible_key
                    break

            hymns.append({
                "id": song_id,
                "title": title,
                "lyrics": lyrics,
                "author": author,
                "is_featured": favorites == "1" or favorites.lower() == "selected",
                "reference": reference,
                "language": language,
                "category": category,
                "key": key_signature
            })
        except Exception as e:
            print("Error parsing row:", row[:2], e)

unique_hymns = {}
for h in hymns:
    unique_hymns[h["id"]] = h

final_list = [unique_hymns[k] for k in sorted(unique_hymns.keys())]

print(f"Total songs parsed: {len(final_list)}")
print(f"First song: #{final_list[0]['id']} {final_list[0]['title']}")
print(f"Song 1: #{final_list[1]['id']} {final_list[1]['title']}")
print(f"Song 361: #{next(h for h in final_list if h['id'] == 361)['title']}")
print(f"Last song: #{final_list[-1]['id']} {final_list[-1]['title']}")

with open("src/data/hymns.json", "w", encoding="utf-8") as f:
    json.dump(final_list, f, ensure_ascii=False, indent=2)

print("Saved src/data/hymns.json successfully!")
