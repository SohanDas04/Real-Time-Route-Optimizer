import pandas as pd, xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

df = pd.read_csv("traffic_data.csv", names=[
    "timestamp","hour","weekday","lat1","lng1","lat2","lng2",
    "current_speed","free_flow_speed"
])

# Target: predict speed 15 mins from now
df["speed_lag1"] = df["current_speed"].shift(3)   # 15 min ago
df["speed_lag2"] = df["current_speed"].shift(6)   # 30 min ago
df["congestion"] = df["current_speed"] / df["free_flow_speed"]
df = df.dropna()

features = ["hour","weekday","lat1","lng1","lat2","lng2",
            "congestion","speed_lag1","speed_lag2"]
X = df[features]
y = df["current_speed"].shift(-3).dropna()   # speed in 15 min
X = X.iloc[:len(y)]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = xgb.XGBRegressor(n_estimators=200, max_depth=5, learning_rate=0.05)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print(f"MAE: {mean_absolute_error(y_test, preds):.2f} km/h")
model.save_model("traffic_model.ubj")