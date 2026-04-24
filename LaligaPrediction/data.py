import pandas as pd
import glob

# 1. Find all CSV files that match your naming pattern (e.g., season-2425.csv, season-2324.csv)
# If your files are named differently, change "season*.csv" to whatever matches, like "*.csv"
all_files = glob.glob("season*.csv")

# 2. Create an empty list to hold each season's data
df_list = []

for file in all_files:
    # Read each file
    df = pd.read_csv(file)
    print(f"Loaded {file} with {len(df)} matches.")
    df_list.append(df)

# 3. Combine them all together into one giant DataFrame!
# ignore_index=True ensures the row numbers reset smoothly from 0 to the end.
master_df = pd.concat(df_list, ignore_index=True)

# 4. Save the master dataset to a new CSV file
master_df.to_csv("master_dataset.csv", index=False)

print(f"\n✅ Success! Master dataset created with {len(master_df)} total matches.")
