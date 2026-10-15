# MAYA AI — Android Studio Setup & Build Guide (Hindi)

MAYA AI एक आधुनिक, सुरक्षित और शक्तिशाली Android Voice Assistant है जिसे Jetpack Compose और Kotlin में बनाया गया है।

## आवश्यक चीजें (Requirements)
1. **Android Studio** (Koala / Ladybug या नवीनतम संस्करण)
2. **JDK 17**
3. **Android Phone** (Android 8.0 Oreo या अधिक) USB Debugging ऑन के साथ

## कदम 1: प्रोजेक्ट खोलें
1. इस डाउनलोड की गई ZIP फाइल को अपने कंप्यूटर पर Extract करें।
2. Android Studio खोलें और **"Open"** पर क्लिक करें।
3. Extract किए गए `MayaAI` फोल्डर को चुनें।
4. Android Studio को Gradle Sync पूरा करने दें (इंटरनेट कनेक्शन चालू रखें)।

## कदम 2: Background Image Asset
- असली बैकग्राउंड इमेज `app/src/main/res/drawable/maya_background.jpg` में शामिल है।
- यह होम स्क्रीन पर बिना किसी स्ट्रेच के 100% फिट बैठती है।

## कदम 3: फोन में इनस्टॉल और टेस्ट करें
1. अपने Android फ़ोन की **Settings -> About Phone -> Build Number** पर 7 बार टैप करें (Developer Options चालू हो जाएगा)।
2. **Developer Options -> USB Debugging** को ON करें।
3. फ़ोन को USB केबल से PC से कनेक्ट करें।
4. Android Studio में ऊपर दिए गए हरे **"Run" (Play) बटन** पर क्लिक करें।
5. MAYA AI आपके फ़ोन पर सीधे इंस्टॉल और लॉन्च हो जाएगी!

## कदम 4: Permissions Enable करें
ऐप खोलने पर निम्नलिखित अनुमतियाँ दें:
- **Microphone**: हिंदी और अंग्रेजी वॉइस कमांड के लिए।
- **Camera / Flashlight**: टॉर्च ऑन/ऑफ और विज़न स्कैन के लिए।
- **Phone / Contacts**: कॉल और संपर्क खोजने के लिए।
- **Accessibility Service (वैकल्पिक)**: अगर आप Maya से Home, Back और नेविगेशन कराना चाहते हैं, तो Settings -> Accessibility -> Maya AI को On करें।
