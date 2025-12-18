from flask import Flask, render_template, request, jsonify
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

# Modelleri Yükle
def model_yukle():
    with open("model_dosyalarim.pkl", "rb") as dosya:
        data = pickle.load(dosya)
    return data

try:
    data = model_yukle()
    scaler = data["scaler"]
    kmeans_model = data["kmeans_model"]
    clf_model = data["classification_model"]
except:
    print("HATA: Model dosyası bulunamadı!")

@app.route('/')
def ana_sayfa():
    return render_template('index.html')

@app.route('/analiz_et', methods=['POST'])
def analiz_et():
    try:
        # JavaScript'ten gelen veriyi al
        data = request.form
        
        degerler = [
            float(data['admin']),
            float(data['info']),
            float(data['product']),
            float(data['bounce']),
            float(data['exit']),
            float(data['page_value'])
        ]
        
        # DataFrame oluştur
        df = pd.DataFrame([degerler], columns=['Administrative_Duration', 'Informational_Duration', 'ProductRelated_Duration', 'BounceRates', 'ExitRates', 'PageValues'])
        
        # Ölçekle
        scaled_data = scaler.transform(df)
        
        # Tahminler
        satin_alma = clf_model.predict(scaled_data)[0]
        olasilik = clf_model.predict_proba(scaled_data)[0][1]
        segment = kmeans_model.predict(scaled_data)[0]
        
        # Sonuçları JSON olarak döndür
        return jsonify({
            'success': True,
            'satin_alma': int(satin_alma),
            'olasilik': round(olasilik * 100, 1),
            'segment': int(segment)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)