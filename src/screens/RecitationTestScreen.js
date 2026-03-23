import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Audio } from "expo-av";

// ✅ Reusing HER existing files
import { colors } from "../styles/colors";
import { globalStyles } from "../styles/globalStyles";
import { wp, hp, fp } from "../utils/responsive";
import { evaluateRecitation } from "../services/claudeService";
import { transcribeAudio } from "../services/whisperService";

export default function RecitationTestScreen({ route, navigation }) {
    // She passes verse data the same way TestScreen.js does
    const { verseText, surahName, ayahNumber } = route.params;

    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY,
            );
            setRecording(recording);
            setIsRecording(true);
            setResult(null);
        } catch (err) {
            Alert.alert("خطأ", "تعذّر الوصول إلى الميكروفون");
        }
    };

    const stopAndAnalyze = async () => {
        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            setIsAnalyzing(true);

            const { text, pauseInfo } = await transcribeAudio(uri);
            const evaluation = await evaluateRecitation(verseText, text, pauseInfo);
            setResult(evaluation);
        } catch (err) {
            Alert.alert("خطأ", "فشل التحليل، حاول مجدداً");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getWordStyle = (index) => {
        if (!result) return {};
        const mistake = result.mistakes.find((m) => m.word_index === index);
        if (!mistake) return styles.wordCorrect;
        return mistake.severity === "error" ? styles.wordError : styles.wordWarning;
    };

    const words = verseText.split(" ");

    return (
        <View style={[globalStyles.container, styles.screen]}>
            {/* Header — matches her app's pattern */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>‹ رجوع</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>تقييم التلاوة</Text>
                <View style={styles.riwayaBadge}>
                    <Text style={styles.riwayaText}>رواية قالون</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Verse display */}
                <View style={styles.verseContainer}>
                    <Text style={styles.verseLabel}>
                        {surahName} — الآية {ayahNumber}
                    </Text>
                    <Text style={styles.verseText}>
                        {words.map((word, idx) => (
                            <Text
                                key={idx}
                                onPress={() => setSelectedWord(idx)}
                                style={[
                                    styles.word,
                                    getWordStyle(idx),
                                    selectedWord === idx && styles.wordSelected,
                                ]}
                            >
                                {word}{" "}
                            </Text>
                        ))}
                    </Text>
                </View>

                {/* Score strip */}
                {result && (
                    <View style={styles.scoreStrip}>
                        <View style={styles.scoreCard}>
                            <Text style={[styles.scoreNum, { color: colors.primary }]}>
                                {result.overall_score}٪
                            </Text>
                            <Text style={styles.scoreLabel}>الدقة</Text>
                        </View>
                        <View style={styles.scoreCard}>
                            <Text style={[styles.scoreNum, { color: "#c0392b" }]}>
                                {result.mistakes.filter((m) => m.severity === "error").length}
                            </Text>
                            <Text style={styles.scoreLabel}>أخطاء</Text>
                        </View>
                        <View style={styles.scoreCard}>
                            <Text style={[styles.scoreNum, { color: "#e67e22" }]}>
                                {result.mistakes.filter((m) => m.severity === "warning").length}
                            </Text>
                            <Text style={styles.scoreLabel}>تنبيهات</Text>
                        </View>
                    </View>
                )}

                {/* Record button */}
                <View style={styles.recordArea}>
                    {isAnalyzing ? (
                        <>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={styles.hint}>جارٍ تحليل التلاوة...</Text>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={[
                                    styles.recordBtn,
                                    isRecording && styles.recordBtnActive,
                                ]}
                                onPress={isRecording ? stopAndAnalyze : startRecording}
                            >
                                <Text style={styles.recordIcon}>
                                    {isRecording ? "⏹" : "🎙"}
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.hint}>
                                {isRecording
                                    ? "جارٍ التسجيل... اضغط للإيقاف والتقييم"
                                    : "اضغط للتسجيل"}
                            </Text>
                        </>
                    )}
                </View>

                {/* Praise/tip */}
                {result?.praise && (
                    <View style={styles.praiseBox}>
                        <Text style={styles.praiseText}>✨ {result.praise}</Text>
                    </View>
                )}
                {result?.tip && (
                    <View style={styles.tipBox}>
                        <Text style={styles.tipText}>💡 {result.tip}</Text>
                    </View>
                )}

                {/* Mistake list */}
                {result?.mistakes?.map((mistake, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.mistakeCard}
                        onPress={() => setSelectedWord(mistake.word_index)}
                    >
                        <View
                            style={[
                                styles.mistakeDot,
                                {
                                    backgroundColor:
                                        mistake.severity === "error" ? "#c0392b" : "#e67e22",
                                },
                            ]}
                        />
                        <View style={styles.mistakeContent}>
                            <Text style={styles.mistakeWord}>{mistake.word}</Text>
                            <Text
                                style={[
                                    styles.mistakeType,
                                    {
                                        color: mistake.severity === "error" ? "#c0392b" : "#e67e22",
                                    },
                                ]}
                            >
                                {mistake.type.replace(/_/g, " ")}
                            </Text>
                            <Text style={styles.mistakeDesc}>{mistake.description_ar}</Text>
                            <Text style={styles.mistakeSub}>
                                المطلوب: {mistake.expected} | المسموع: {mistake.heard}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f9f7f2" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp(4),
        paddingTop: hp(6),
        paddingBottom: hp(2),
        backgroundColor: "#1a1a2e",
    },
    backBtn: { color: "#8b9bc8", fontSize: fp(16) },
    headerTitle: { color: "#fff", fontSize: fp(16), fontWeight: "500" },
    riwayaBadge: {
        borderWidth: 0.5,
        borderColor: "#8b9bc8",
        borderRadius: 20,
        paddingHorizontal: wp(3),
        paddingVertical: 3,
    },
    riwayaText: { color: "#8b9bc8", fontSize: fp(10) },
    scroll: { padding: wp(4), paddingBottom: hp(4) },
    verseContainer: {
        backgroundColor: "#f0eee8",
        borderRadius: 12,
        padding: wp(4),
        marginBottom: hp(2),
        direction: "rtl",
    },
    verseLabel: {
        fontSize: fp(11),
        color: "#888",
        marginBottom: hp(1),
        textAlign: "right",
    },
    verseText: {
        fontFamily: "ScheherazadeNew", // ✅ uses HER existing font
        fontSize: fp(26),
        lineHeight: fp(26) * 1.8,
        textAlign: "center",
        color: "#1a1a1a",
        writingDirection: "rtl",
    },
    word: { color: "#1a1a1a" },
    wordCorrect: { color: "#1a5c2e" },
    wordError: {
        color: "#c0392b",
        textDecorationLine: "underline",
        textDecorationColor: "#e74c3c",
    },
    wordWarning: { color: "#8a5500" },
    wordSelected: { backgroundColor: "rgba(26,92,46,0.12)", borderRadius: 4 },
    scoreStrip: {
        flexDirection: "row",
        gap: wp(2),
        marginBottom: hp(2),
    },
    scoreCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: wp(3),
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: "#ddd",
    },
    scoreNum: { fontSize: fp(22), fontWeight: "500" },
    scoreLabel: { fontSize: fp(10), color: "#888", marginTop: 2 },
    recordArea: {
        alignItems: "center",
        paddingVertical: hp(3),
        marginBottom: hp(2),
    },
    recordBtn: {
        width: wp(18),
        height: wp(18),
        borderRadius: wp(9),
        backgroundColor: "#1a1a2e",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp(1.5),
    },
    recordBtnActive: { backgroundColor: "#c0392b" },
    recordIcon: { fontSize: fp(26) },
    hint: { fontSize: fp(12), color: "#888" },
    praiseBox: {
        backgroundColor: "#e8f5e9",
        borderRadius: 10,
        padding: wp(3),
        marginBottom: hp(1.5),
    },
    praiseText: {
        color: "#1a5c2e",
        fontSize: fp(13),
        textAlign: "right",
        fontFamily: "ScheherazadeNew",
    },
    tipBox: {
        backgroundColor: "#fff8e1",
        borderRadius: 10,
        padding: wp(3),
        marginBottom: hp(2),
    },
    tipText: { color: "#8a5500", fontSize: fp(13), textAlign: "right" },
    mistakeCard: {
        flexDirection: "row",
        gap: wp(3),
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: wp(3),
        marginBottom: hp(1.5),
        borderWidth: 0.5,
        borderColor: "#eee",
    },
    mistakeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 5,
        flexShrink: 0,
    },
    mistakeContent: { flex: 1 },
    mistakeWord: {
        fontFamily: "ScheherazadeNew",
        fontSize: fp(20),
        textAlign: "right",
        color: "#1a1a1a",
    },
    mistakeType: { fontSize: fp(11), fontWeight: "500", marginVertical: 2 },
    mistakeDesc: {
        fontSize: fp(12),
        color: "#555",
        textAlign: "right",
        lineHeight: fp(12) * 1.5,
    },
    mistakeSub: {
        fontSize: fp(11),
        color: "#999",
        textAlign: "right",
        marginTop: 3,
    },
});
