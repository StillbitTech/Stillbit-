
import numpy as np
import pandas as pd
from typing import List, Dict, Any
import datetime
import math
import random

class AIPredictor:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.model = None
        self.features = []

    def preprocess(self):
        self.data = self.data.dropna()
        self.data['timestamp'] = pd.to_datetime(self.data['timestamp'])
        self.data['hour'] = self.data['timestamp'].dt.hour
        self.data['day'] = self.data['timestamp'].dt.dayofweek
        self.data['price_diff'] = self.data['price'].diff().fillna(0)
        self.features = ['hour', 'day', 'price_diff']

    def normalize(self):
        for feature in self.features:
            self.data[feature] = (self.data[feature] - self.data[feature].mean()) / self.data[feature].std()

    def train_model(self):
        X = self.data[self.features].values
        y = (self.data['price'].shift(-1) > self.data['price']).astype(int).fillna(0)
        weights = np.random.rand(X.shape[1])
        for _ in range(100):
            predictions = self.sigmoid(np.dot(X, weights))
            errors = y - predictions
            weights += 0.01 * np.dot(X.T, errors)
        self.model = weights

    def predict(self, new_data: Dict[str, Any]) -> float:
        x = np.array([new_data[feature] for feature in self.features])
        return float(self.sigmoid(np.dot(x, self.model)))

    @staticmethod
    def sigmoid(z):
        return 1 / (1 + np.exp(-z))

    def evaluate(self):
        X = self.data[self.features].values
        y = (self.data['price'].shift(-1) > self.data['price']).astype(int).fillna(0)
        predictions = self.sigmoid(np.dot(X, self.model))
        predictions = (predictions > 0.5).astype(int)
        accuracy = (predictions == y).mean()
        return accuracy

def generate_data(rows: int = 500) -> pd.DataFrame:
    base_time = datetime.datetime.now()
    timestamps = [base_time - datetime.timedelta(minutes=5 * i) for i in range(rows)]
    prices = np.cumsum(np.random.randn(rows) * 0.5 + 100)
    return pd.DataFrame({'timestamp': timestamps, 'price': prices})

def run_analysis():
    df = generate_data()
    predictor = AIPredictor(df)
    predictor.preprocess()
    predictor.normalize()
    predictor.train_model()
    test_input = {
        'hour': 14,
        'day': 2,
        'price_diff': 0.03
    }
    score = predictor.predict(test_input)
    acc = predictor.evaluate()
    print(f"Predicted value: {score:.4f}, Accuracy: {acc:.2%}")

if __name__ == "__main__":
    run_analysis()
