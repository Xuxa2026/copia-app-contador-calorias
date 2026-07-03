import { useState, useRef, useEffect } from "react";

// TODO: Integrar API real de reconocimiento de alimentos con IA (OpenAI Vision / Clarifai / Nutritionix)
// TODO: Implementar sistema de autenticación real (Firebase Auth / Supabase)
// TODO: Conectar base de datos para persistir datos del usuario
// TODO: Implementar notificaciones push para recordatorios de comidas
// TODO: Sistema de suscripción premium real (Stripe / RevenueCat)

const PRIMARY = "#4CAF82";
const PRIMARY_DARK = "#388E5F";
const PRIMARY_LIGHT = "#E8F5EE";
const ACCENT = "#FF6B6B";
const BG = "#F7FAF8";
const CARD = "#FFFFFF";
const TEXT = "#1A2E22";
const TEXT_MUTED = "#7A9188";
const BORDER = "#DDE8E3";

const SAMPLE_FOODS = [
  { id: 1, name: "Avena con frutas", cal: 320, protein: 12, carbs: 58, fat: 6, emoji: "🥣", time: "08:00", meal: "Desayuno" },
  { id: 2, name: "Pechuga de pollo a la plancha", cal: 285, protein: 52, carbs: 0, fat: 6, emoji: "🍗", time: "13:30", meal: "Almuerzo" },
  { id: 3, name: "Ensalada mixta con atún", cal: 210, protein: 28, carbs: 12, fat: 8, emoji: "🥗", time: "13:35", meal: "Almuerzo" },
  { id: 4, name: "Manzana", cal: 95, protein: 0, carbs: 25, fat: 0, emoji: "🍎", time: "16:00", meal: "Merienda" },
  { id: 5, name: "Salmón con verduras", cal: 380, protein: 42, carbs: 18, fat: 14, emoji: "🐟", time: "20:00", meal: "Cena" },
];

const FOOD_DATABASE = [
  { name: "Manzana", cal: 95, protein: 0, carbs: 25, fat: 0, emoji: "🍎", portion: "1 unidad (182g)" },
  { name: "Banana", cal: 105, protein: 1, carbs: 27, fat: 0, emoji: "🍌", portion: "1 unidad (118g)" },
  { name: "Arroz blanco cocido", cal: 206, protein: 4, carbs: 45, fat: 0, emoji: "🍚", portion: "1 taza (186g)" },
  { name: "Pechuga de pollo", cal: 165, protein: 31, carbs: 0, fat: 4, emoji: "🍗", portion: "100g" },
  { name: "Huevo entero", cal: 78, protein: 6, carbs: 1, fat: 5, emoji: "🥚", portion: "1 unidad (50g)" },
  { name: "Pan integral", cal: 81, protein: 4, carbs: 15, fat: 1, emoji: "🍞", portion: "1 rebanada (28g)" },
  { name: "Leche entera", cal: 149, protein: 8, carbs: 12, fat: 8, emoji: "🥛", portion: "1 taza (244ml)" },
  { name: "Aguacate", cal: 234, protein: 3, carbs: 12, fat: 21, emoji: "🥑", portion: "1 unidad (150g)" },
  { name: "Brócoli", cal: 55, protein: 4, carbs: 11, fat: 1, emoji: "🥦", portion: "1 taza (91g)" },
  { name: "Yogur griego", cal: 100, protein: 17, carbs: 6, fat: 0, emoji: "🥛", portion: "100g" },
  { name: "Almendras", cal: 164, protein: 6, carbs: 6, fat: 14, emoji: "🌰", portion: "28g (23 unidades)" },
  { name: "Atún en lata", cal: 120, protein: 26, carbs: 0, fat: 1, emoji: "🐟", portion: "100g" },
  { name: "Pasta cocida", cal: 220, protein: 8, carbs: 43, fat: 1, emoji: "🍝", portion: "1 taza (140g)" },
  { name: "Tomate", cal: 22, protein: 1, carbs: 5, fat: 0, emoji: "🍅", portion: "1 unidad (123g)" },
  { name: "Naranja", cal: 62, protein: 1, carbs: 15, fat: 0, emoji: "🍊", portion: "1 unidad (131g)" },
];

const ACHIEVEMENTS = [
  { id: 1, title: "Primera semana", desc: "7 días seguidos registrando", emoji: "🔥", unlocked: true },
  { id: 2, title: "Mes perfecto", desc: "30 días de racha", emoji: "🏆", unlocked: false },
  { id: 3, title: "Meta alcanzada", desc: "Alcanzaste tu meta de peso", emoji: "🎯", unlocked: true },
  { id: 4, title: "Hidratación", desc: "7 días bebiendo 2L de agua", emoji: "💧", unlocked: false },
  { id: 5, title: "Proteína pro", desc: "Meta de proteína 10 días seguidos", emoji: "💪", unlocked: true },
];

const TIPS = [
  "🌟 Cada día es una nueva oportunidad para mejorar.",
  "💪 Confía en ti, eres más capaz de lo que imaginas.",
  "🚀 El éxito comienza cuando decides intentarlo.",
  "🌈 Los errores son lecciones que te acercan a tus metas.",
  "🔥 Sigue adelante, tú puedes lograrlo.",
  "🥗 Incluir más verduras en cada comida mejora tu energía.",
  "💧 Beber agua antes de comer ayuda a controlar las porciones.",
];

function CircularProgress({ value, max, size = 120, color = PRIMARY, label, sublabel }) {
  const pct = Math.min(value / max, 1);
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BORDER} strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>{value}</div>
        <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 9, color: TEXT_MUTED }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function MacroBar({ label, value, max, color, unit = "g" }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{label}</span>
        <span style={{ fontSize: 13, color: TEXT_MUTED }}>{value}{unit} / {max}{unit}</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: BORDER, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function FoodCard({ food, onDelete }) {
  return (
    <div style={{
      background: CARD, borderRadius: 16, padding: "12px 16px",
      marginBottom: 10, display: "flex", alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`
    }}>
      <span style={{ fontSize: 28, marginRight: 12 }}>{food.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: TEXT }}>{food.name}</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{food.time} · {food.meal}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 11, background: "#FFF3E0", color: "#E65100", borderRadius: 8, padding: "2px 8px", fontWeight: 600 }}>P: {food.protein}g</span>
          <span style={{ fontSize: 11, background: "#E3F2FD", color: "#1565C0", borderRadius: 8, padding: "2px 8px", fontWeight: 600 }}>C: {food.carbs}g</span>
          <span style={{ fontSize: 11, background: "#FCE4EC", color: "#880E4F", borderRadius: 8, padding: "2px 8px", fontWeight: 600 }}>G: {food.fat}g</span>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: PRIMARY }}>{food.cal}</div>
        <div style={{ fontSize: 10, color: TEXT_MUTED }}>kcal</div>
        {onDelete && (
          <button onClick={() => onDelete(food.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: ACCENT, fontSize: 18, marginTop: 4, padding: 0
          }}>✕</button>
        )}
      </div>
    </div>
  );
}

function HomeScreen({ foods, calorieGoal, streak, onAddFood, waterGlasses, setWaterGlasses }) {
  const totalCal = foods.reduce((s, f) => s + f.cal, 0);
  const totalProtein = foods.reduce((s, f) => s + f.protein, 0);
  const totalCarbs = foods.reduce((s, f) => s + f.carbs, 0);
  const totalFat = foods.reduce((s, f) => s + f.fat, 0);
  const remaining = Math.max(calorieGoal - totalCal, 0);
  const tipIndex = new Date().getDay();
  const meals = ["Desayuno", "Almuerzo", "Merienda", "Cena"];

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, color: TEXT_MUTED }}>Buenos días 👋</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>Mi Dashboard</div>
        </div>
        <div style={{
          background: PRIMARY, color: "#fff", borderRadius: 14, padding: "8px 14px",
          fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6
        }}>
          🔥 {streak} días
        </div>
      </div>

      {/* Tip del día */}
      <div style={{
        background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
        borderRadius: 20, padding: "16px 20px", marginBottom: 20, color: "#fff"
      }}>
        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>Motivación del día</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{TIPS[tipIndex]}</div>
      </div>

      {/* Calorías principales */}
      <div style={{
        background: CARD, borderRadius: 24, padding: 20, marginBottom: 20,
        boxShadow: "0 4px 16px rgba(76,175,130,0.12)", border: `1px solid ${BORDER}`
      }}>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>Consumidas</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: PRIMARY }}>{totalCal}</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED }}>kcal</div>
          </div>
          <CircularProgress value={totalCal} max={calorieGoal} size={130} label="kcal" sublabel={`de ${calorieGoal}`} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>Restantes</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: remaining > 0 ? TEXT : ACCENT }}>{remaining}</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED }}>kcal</div>
          </div>
        </div>
      </div>

      {/* Macronutrientes */}
      <div style={{
        background: CARD, borderRadius: 20, padding: "16px 20px", marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginBottom: 14 }}>Macronutrientes</div>
        <MacroBar label="Proteínas" value={totalProtein} max={150} color="#FF7043" />
        <MacroBar label="Carbohidratos" value={totalCarbs} max={250} color="#42A5F5" />
        <MacroBar label="Grasas" value={totalFat} max={65} color="#EC407A" />
      </div>

      {/* Agua */}
      <div style={{
        background: CARD, borderRadius: 20, padding: "16px 20px", marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: TEXT }}>💧 Hidratación</div>
          <span style={{ fontSize: 13, color: TEXT_MUTED }}>{waterGlasses * 250}ml / 2000ml</span>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {[...Array(8)].map((_, i) => (
            <button key={i} onClick={() => setWaterGlasses(i < waterGlasses ? i : i + 1)} style={{
              width: 36, height: 36, borderRadius: 10, border: "2px solid",
              borderColor: i < waterGlasses ? "#42A5F5" : BORDER,
              background: i < waterGlasses ? "#E3F2FD" : "#F5F5F5",
              fontSize: 18, cursor: "pointer", transition: "all 0.2s"
            }}>
              💧
            </button>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: TEXT_MUTED }}>
          {waterGlasses} de 8 vasos ({waterGlasses * 250}ml)
        </div>
      </div>

      {/* Comidas del día */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: TEXT }}>Comidas de hoy</div>
        <button onClick={onAddFood} style={{
          background: PRIMARY, color: "#fff", border: "none", borderRadius: 12,
          padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer"
        }}>+ Añadir</button>
      </div>
      {meals.map(meal => {
        const mealFoods = foods.filter(f => f.meal === meal);
        const mealCal = mealFoods.reduce((s, f) => s + f.cal, 0);
        return (
          <div key={meal} style={{ marginBottom: 8 }}>
            <div style={{
              background: PRIMARY_LIGHT, borderRadius: 12, padding: "8px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: mealFoods.length > 0 ? 6 : 0
            }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: PRIMARY_DARK }}>{meal}</span>
              <span style={{ fontSize: 13, color: TEXT_MUTED }}>{mealCal > 0 ? `${mealCal} kcal` : "Sin registrar"}</span>
            </div>
            {mealFoods.map(f => (
              <div key={f.id} style={{
                background: CARD, borderRadius: 10, padding: "8px 14px",
                marginBottom: 4, display: "flex", alignItems: "center",
                border: `1px solid ${BORDER}`
              }}>
                <span style={{ marginRight: 8, fontSize: 20 }}>{f.emoji}</span>
                <span style={{ flex: 1, fontSize: 13, color: TEXT }}>{f.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY }}>{f.cal} kcal</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ScannerScreen({ onFoodAdded }) {
  const [step, setStep] = useState("idle"); // idle, scanning, result, manual
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [scannedFood, setScannedFood] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState("Desayuno");
  const [portion, setPortion] = useState(1);
  const fileRef = useRef(null);

  // TODO: Integrar API real de reconocimiento de imagen (OpenAI GPT-4 Vision / Google Vision API)
  const simulateScan = () => {
    setStep("scanning");
    setTimeout(() => {
      const randomFood = FOOD_DATABASE[Math.floor(Math.random() * FOOD_DATABASE.length)];
      setScannedFood({ ...randomFood, id: Date.now() });
      setStep("result");
    }, 2500);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.length > 1) {
      const filtered = FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const addFood = (food) => {
    const newFood = {
      ...food,
      id: Date.now(),
      cal: Math.round(food.cal * portion),
      protein: Math.round(food.protein * portion),
      carbs: Math.round(food.carbs * portion),
      fat: Math.round(food.fat * portion),
      time: new Date().toTimeString().slice(0, 5),
      meal: selectedMeal
    };
    onFoodAdded(newFood);
    setStep("idle");
    setScannedFood(null);
    setPortion(1);
    setSearchQuery("");
    setSearchResults([]);
  };

  const meals = ["Desayuno", "Almuerzo", "Merienda", "Cena"];

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 20 }}>
        📷 Escáner de Alimentos
      </div>

      {step === "idle" && (
        <>
          {/* Botón de escaneo */}
          <div style={{
            background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
            borderRadius: 24, padding: 32, textAlign: "center", marginBottom: 24,
            boxShadow: "0 8px 24px rgba(76,175,130,0.3)"
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📷</div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Toma una foto de tu comida
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 20 }}>
              La IA detectará los alimentos y calculará sus calorías automáticamente
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={simulateScan} style={{
                background: "#fff", color: PRIMARY, border: "none", borderRadius: 16,
                padding: "12px 24px", fontSize: 14, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}>
                📸 Tomar Foto
              </button>
              <button onClick={() => fileRef.current?.click()} style={{
                background: "rgba(255,255,255,0.2)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)",
                borderRadius: 16, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>
                🖼️ Galería
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={simulateScan} />
            </div>
          </div>

          {/* Búsqueda manual */}
          <div style={{
            background: CARD, borderRadius: 20, padding: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`
          }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginBottom: 14 }}>
              🔍 Buscar alimento
            </div>
            <input
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Ej: manzana, pollo, arroz..."
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 14,
                border: `1.5px solid ${BORDER}`, fontSize: 14, color: TEXT,
                background: BG, outline: "none", boxSizing: "border-box"
              }}
            />
            {searchResults.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {searchResults.slice(0, 6).map(food => (
                  <div key={food.name} onClick={() => { setScannedFood({ ...food, id: Date.now() }); setStep("result"); }}
                    style={{
                      display: "flex", alignItems: "center", padding: "10px 12px",
                      borderRadius: 12, cursor: "pointer", marginBottom: 6,
                      background: PRIMARY_LIGHT, border: `1px solid ${BORDER}`,
                      transition: "all 0.2s"
                    }}>
                    <span style={{ fontSize: 24, marginRight: 12 }}>{food.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: TEXT }}>{food.name}</div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED }}>{food.portion}</div>
                    </div>
                    <span style={{ fontWeight: 700, color: PRIMARY }}>{food.cal} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {step === "scanning" && (
        <div style={{
          background: CARD, borderRadius: 24, padding: 48, textAlign: "center",
          boxShadow: "0 4px 16px rgba(76,175,130,0.12)", border: `1px solid ${BORDER}`
        }}>
          <div style={{ fontSize: 64, marginBottom: 20, animation: "pulse 1s infinite" }}>🔍</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: TEXT, marginBottom: 8 }}>
            Analizando tu comida...
          </div>
          <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 24 }}>
            La IA está identificando los alimentos y calculando los valores nutricionales
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: "50%", background: PRIMARY,
                animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`
              }} />
            ))}
          </div>
        </div>
      )}

      {step === "result" && scannedFood && (
        <div>
          <div style={{
            background: CARD, borderRadius: 24, padding: 24, marginBottom: 16,
            boxShadow: "0 4px 16px rgba(76,175,130,0.12)", border: `1px solid ${BORDER}`
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 64, marginBottom: 8 }}>{scannedFood.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: TEXT }}>{scannedFood.name}</div>
              <div style={{ fontSize: 13, color: TEXT_MUTED }}>{scannedFood.portion}</div>
            </div>

            <div style={{
              background: PRIMARY_LIGHT, borderRadius: 16, padding: 16,
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: PRIMARY }}>{Math.round(scannedFood.cal * portion)}</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>Calorías</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#FF7043" }}>{Math.round(scannedFood.protein * portion)}g</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>Proteínas</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#42A5F5" }}>{Math.round(scannedFood.carbs * portion)}g</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>Carbohidratos</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#EC407A" }}>{Math.round(scannedFood.fat * portion)}g</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>Grasas</div>
              </div>
            </div>

            {/* Porciones */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 8 }}>Porciones</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setPortion(p => Math.max(0.5, p - 0.5))} style={{
                  width: 36, height: 36, borderRadius: 10, border: `2px solid ${BORDER}`,
                  background: BG, fontSize: 18, cursor: "pointer", fontWeight: 700
                }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 700, flex: 1, textAlign: "center" }}>{portion}x</span>
                <button onClick={() => setPortion(p => p + 0.5)} style={{
                  width: 36, height: 36, borderRadius: 10, border: `2px solid ${PRIMARY}`,
                  background: PRIMARY_LIGHT, fontSize: 18, cursor: "pointer", fontWeight: 700, color: PRIMARY
                }}>+</button>
              </div>
            </div>

            {/* Seleccionar comida */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 8 }}>¿Cuándo lo comiste?</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Desayuno", "Almuerzo", "Merienda", "Cena"].map(m => (
                  <button key={m} onClick={() => setSelectedMeal(m)} style={{
                    padding: "8px 16px", borderRadius: 12, border: "2px solid",
                    borderColor: selectedMeal === m ? PRIMARY : BORDER,
                    background: selectedMeal === m ? PRIMARY : CARD,
                    color: selectedMeal === m ? "#fff" : TEXT_MUTED,
                    fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s"
                  }}>{m}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setStep("idle"); setScannedFood(null); setPortion(1); }} style={{
                flex: 1, padding: 14, borderRadius: 16, border: `2px solid ${BORDER}`,
                background: CARD, color: TEXT_MUTED, fontWeight: 700, fontSize: 15, cursor: "pointer"
              }}>Cancelar</button>
              <button onClick={() => addFood(scannedFood)} style={{
                flex: 2, padding: 14, borderRadius: 16, border: "none",
                background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer"
              }}>✓ Añadir alimento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DiaryScreen({ foods, onDelete }) {
  const totalCal = foods.reduce((s, f) => s + f.cal, 0);
  const meals = ["Desayuno", "Almuerzo", "Merienda", "Cena"];

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 6 }}>📔 Diario de Comidas</div>
      <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>
        {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </div>

      {/* Resumen del día */}
      <div style={{
        background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
        borderRadius: 20, padding: 20, marginBottom: 20, color: "#fff"
      }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{totalCal}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>kcal totales</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{foods.length}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>alimentos</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{foods.reduce((s, f) => s + f.protein, 0)}g</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>proteínas</div>
          </div>
        </div>
      </div>

      {/* Comidas por categoría */}
      {meals.map(meal => {
        const mealFoods = foods.filter(f => f.meal === meal);
        const mealCal = mealFoods.reduce((s, f) => s + f.cal, 0);
        return (
          <div key={meal} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: TEXT }}>{meal}</div>
              {mealCal > 0 && <div style={{ fontSize: 13, color: PRIMARY, fontWeight: 700 }}>{mealCal} kcal</div>}
            </div>
            {mealFoods.length === 0 ? (
              <div style={{
                border: `2px dashed ${BORDER}`, borderRadius: 16, padding: 20,
                textAlign: "center", color: TEXT_MUTED, fontSize: 13
              }}>
                Sin alimentos registrados en {meal.toLowerCase()}
              </div>
            ) : (
              mealFoods.map(food => <FoodCard key={food.id} food={food} onDelete={onDelete} />)
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProgressScreen({ streak, foods, calorieGoal }) {
  const totalCal = foods.reduce((s, f) => s + f.cal, 0);
  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
  const weekData = [1820, 2100, 1950, calorieGoal, 2080, 1760, totalCal];
  const maxVal = Math.max(...weekData, calorieGoal);

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 20 }}>📊 Mi Progreso</div>

      {/* Racha */}
      <div style={{
        background: `linear-gradient(135deg, #FF6B35, #FF8E53)`,
        borderRadius: 24, padding: 24, marginBottom: 20, color: "#fff", textAlign: "center"
      }}>
        <div style={{ fontSize: 64 }}>🔥</div>
        <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{streak}</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Días de racha</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>
          ¡Sigue así! Cada día que registras tu comida mejoras tu salud
        </div>
      </div>

      {/* Gráfica semanal */}
      <div style={{
        background: CARD, borderRadius: 24, padding: 20, marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginBottom: 16 }}>
          Calorías esta semana
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {weekDays.map((day, i) => {
            const h = (weekData[i] / maxVal) * 100;
            const isToday = i === 6;
            return (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>{weekData[i]}</div>
                <div style={{
                  width: "100%", height: `${h}%`, borderRadius: "8px 8px 4px 4px",
                  background: isToday ? PRIMARY : PRIMARY_LIGHT,
                  border: isToday ? `2px solid ${PRIMARY_DARK}` : "none",
                  minHeight: 8, transition: "height 0.5s ease"
                }} />
                <div style={{
                  fontSize: 11, fontWeight: isToday ? 800 : 600,
                  color: isToday ? PRIMARY : TEXT_MUTED
                }}>{day}</div>
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 12, padding: "8px 12px", background: PRIMARY_LIGHT,
          borderRadius: 10, display: "flex", justifyContent: "space-between"
        }}>
          <span style={{ fontSize: 13, color: TEXT_MUTED }}>Promedio semanal</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY }}>
            {Math.round(weekData.reduce((s, v) => s + v, 0) / 7)} kcal/día
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Días completados", value: 23, emoji: "✅" },
          { label: "Mejor racha", value: `${streak + 3} días`, emoji: "🏆" },
          { label: "Peso perdido", value: "2.3 kg", emoji: "⚖️" },
          { label: "Meta cumplida", value: "78%", emoji: "🎯" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: CARD, borderRadius: 18, padding: "16px 14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{stat.emoji}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Logros */}
      <div style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginBottom: 12 }}>🏅 Logros</div>
      {ACHIEVEMENTS.map(a => (
        <div key={a.id} style={{
          background: a.unlocked ? CARD : "#F5F5F5", borderRadius: 16, padding: "14px 16px",
          marginBottom: 10, display: "flex", alignItems: "center",
          border: `1px solid ${a.unlocked ? BORDER : "#E0E0E0"}`,
          opacity: a.unlocked ? 1 : 0.6
        }}>
          <span style={{ fontSize: 32, marginRight: 14 }}>{a.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: a.unlocked ? TEXT : TEXT_MUTED }}>{a.title}</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>{a.desc}</div>
          </div>
          {a.unlocked && <span style={{ color: PRIMARY, fontSize: 20 }}>✓</span>}
          {!a.unlocked && <span style={{ color: TEXT_MUTED, fontSize: 18 }}>🔒</span>}
        </div>
      ))}
    </div>
  );
}

function ProfileScreen({ calorieGoal, setCalorieGoal }) {
  const [name, setName] = useState("Usuario");
  const [weight, setWeight] = useState(75);
  const [height, setHeight] = useState(170);
  const [goal, setGoal] = useState("perder");
  const [activity, setActivity] = useState("moderado");
  const [editing, setEditing] = useState(false);

  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  const bmiStatus = bmi < 18.5 ? "Bajo peso" : bmi < 25 ? "Normal" : bmi < 30 ? "Sobrepeso" : "Obesidad";
  const bmiColor = bmi < 18.5 ? "#42A5F5" : bmi < 25 ? PRIMARY : bmi < 30 ? "#FFA726" : ACCENT;

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 20 }}>👤 Mi Perfil</div>

      {/* Avatar y nombre */}
      <div style={{
        background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
        borderRadius: 24, padding: 24, textAlign: "center", marginBottom: 20, color: "#fff"
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40, margin: "0 auto 12px"
        }}>👤</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Meta: {goal === "perder" ? "Perder peso" : goal === "mantener" ? "Mantener peso" : "Ganar músculo"}</div>
        <button onClick={() => setEditing(!editing)} style={{
          marginTop: 14, background: "rgba(255,255,255,0.2)", color: "#fff",
          border: "2px solid rgba(255,255,255,0.5)", borderRadius: 12,
          padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer"
        }}>
          {editing ? "✓ Guardar" : "✏️ Editar perfil"}
        </button>
      </div>

      {/* IMC */}
      <div style={{
        background: CARD, borderRadius: 20, padding: 20, marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginBottom: 14 }}>📏 Índice de Masa Corporal</div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: bmiColor }}>{bmi}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: bmiColor }}>{bmiStatus}</div>
          </div>
          <div>
            {[
              { label: "Bajo peso", range: "< 18.5", color: "#42A5F5" },
              { label: "Normal", range: "18.5 - 24.9", color: PRIMARY },
              { label: "Sobrepeso", range: "25 - 29.9", color: "#FFA726" },
              { label: "Obesidad", range: "≥ 30", color: ACCENT },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color }} />
                <span style={{ fontSize: 12, color: TEXT }}>{r.label}</span>
                <span style={{ fontSize: 11, color: TEXT_MUTED }}>{r.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Datos personales */}
      <div style={{
        background: CARD, borderRadius: 20, padding: 20, marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`
      }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginBottom: 16 }}>Datos personales</div>
        {[
          { label: "Nombre", value: name, type: "text", setter: setName },
          { label: "Peso actual (kg)", value: weight, type: "number", setter: setWeight },
          { label: "Altura (cm)", value: height, type: "number", setter: setHeight },
          { label: "Meta de calorías", value: calorieGoal, type: "number", setter: setCalorieGoal },
        ].map(field => (
          <div key={field.label} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, marginBottom: 4 }}>{field.label}</div>
            {editing ? (
              <input
                type={field.type}
                value={field.value}
                onChange={e => field.setter(field.type === "number" ? Number(e.target.value) : e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 12,
                  border: `1.5px solid ${PRIMARY}`, fontSize: 15, color: TEXT,
                  background: PRIMARY_LIGHT, outline: "none", boxSizing: "border-box"
                }}
              />
            ) : (
              <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{field.value}</div>
            )}
          </div>
        ))}

        {/* Objetivo */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, marginBottom: 8 }}>Mi objetivo</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { val: "perder", label: "Perder peso", emoji: "📉" },
              { val: "mantener", label: "Mantener", emoji: "⚖️" },
              { val: "ganar", label: "Ganar músculo", emoji: "💪" },
            ].map(g => (
              <button key={g.val} onClick={() => editing && setGoal(g.val)} style={{
                flex: 1, padding: "10px 6px", borderRadius: 12, border: "2px solid",
                borderColor: goal === g.val ? PRIMARY : BORDER,
                background: goal === g.val ? PRIMARY_LIGHT : CARD,
                color: goal === g.val ? PRIMARY_DARK : TEXT_MUTED,
                fontWeight: 600, fontSize: 11, cursor: editing ? "pointer" : "default",
                transition: "all 0.2s"
              }}>
                <div>{g.emoji}</div>
                <div>{g.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Actividad */}
        <div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, marginBottom: 8 }}>Nivel de actividad</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["sedentario", "ligero", "moderado", "activo", "muy activo"].map(a => (
              <button key={a} onClick={() => editing && setActivity(a)} style={{
                padding: "6px 12px", borderRadius: 10, border: "2px solid",
                borderColor: activity === a ? PRIMARY : BORDER,
                background: activity === a ? PRIMARY : CARD,
                color: activity === a ? "#fff" : TEXT_MUTED,
                fontWeight: 600, fontSize: 11, cursor: editing ? "pointer" : "default",
                textTransform: "capitalize", transition: "all 0.2s"
              }}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Aviso médico */}
      <div style={{
        background: "#FFF8E1", borderRadius: 16, padding: 16,
        border: "1px solid #FFE082", marginBottom: 20
      }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#F57F17", marginBottom: 6 }}>⚠️ Aviso importante</div>
        <div style={{ fontSize: 12, color: "#795548", lineHeight: 1.5 }}>
          No ofrecemos asesoramiento médico. Todas las recomendaciones deben considerarse sugerencias.
          Consulta a un profesional de la salud antes de probar un nuevo plan de calorías y nutrientes.
        </div>
      </div>
    </div>
  );
}

function RecipesScreen({ onFoodAdded }) {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const categories = ["Todas", "Desayuno", "Almuerzo", "Cena", "Snack"];

  const recipes = [
    { id: 1, name: "Tostadas de aguacate", cal: 320, protein: 10, carbs: 38, fat: 16, emoji: "🥑", time: "10 min", category: "Desayuno", difficulty: "Fácil", ingredients: ["Pan integral", "Aguacate", "Tomate", "Limón", "Sal"] },
    { id: 2, name: "Bowl de pollo y quinoa", cal: 480, protein: 42, carbs: 52, fat: 10, emoji: "🥗", time: "25 min", category: "Almuerzo", difficulty: "Media", ingredients: ["Pechuga de pollo", "Quinoa", "Espinacas", "Tomate cherry", "Aceite de oliva"] },
    { id: 3, name: "Batido proteico de frutas", cal: 290, protein: 24, carbs: 42, fat: 4, emoji: "🥤", time: "5 min", category: "Snack", difficulty: "Fácil", ingredients: ["Plátano", "Proteína en polvo", "Leche de almendras", "Fresas"] },
    { id: 4, name: "Salmón con espárragos", cal: 420, protein: 45, carbs: 12, fat: 22, emoji: "🐟", time: "20 min", category: "Cena", difficulty: "Media", ingredients: ["Salmón", "Espárragos", "Aceite de oliva", "Limón", "Ajo"] },
    { id: 5, name: "Avena con chía y frutas", cal: 380, protein: 14, carbs: 62, fat: 9, emoji: "🥣", time: "8 min", category: "Desayuno", difficulty: "Fácil", ingredients: ["Avena", "Semillas de chía", "Leche", "Banana", "Arándanos"] },
    { id: 6, name: "Ensalada mediterránea", cal: 310, protein: 18, carbs: 24, fat: 16, emoji: "🫙", time: "15 min", category: "Almuerzo", difficulty: "Fácil", ingredients: ["Garbanzos", "Pepino", "Tomate", "Aceitunas", "Feta", "Limón"] },
  ];

  const filtered = selectedCategory === "Todas" ? recipes : recipes.filter(r => r.category === selectedCategory);

  return (
    <div style={{ padding: "16px 16px 100px" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 6 }}>🍽️ Recetas Saludables</div>
      <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 16 }}>Recomendadas para tu objetivo</div>

      {/* Categorías */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
            padding: "8px 18px", borderRadius: 20, border: "2px solid",
            borderColor: selectedCategory === cat ? PRIMARY : BORDER,
            background: selectedCategory === cat ? PRIMARY : CARD,
            color: selectedCategory === cat ? "#fff" : TEXT_MUTED,
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s"
          }}>{cat}</button>
        ))}
      </div>

      {/* Recetas */}
      {filtered.map(recipe => (
        <div key={recipe.id} style={{
          background: CARD, borderRadius: 20, padding: 20, marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}`
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 40 }}>{recipe.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: TEXT }}>{recipe.name}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, background: PRIMARY_LIGHT, color: PRIMARY_DARK, borderRadius: 8, padding: "3px 8px", fontWeight: 600 }}>
                  ⏱ {recipe.time}
                </span>
                <span style={{ fontSize: 11, background: "#E8EAF6", color: "#3949AB", borderRadius: 8, padding: "3px 8px", fontWeight: 600 }}>
                  {recipe.difficulty}
                </span>
                <span style={{ fontSize: 11, background: "#FFF3E0", color: "#E65100", borderRadius: 8, padding: "3px 8px", fontWeight: 600 }}>
                  {recipe.category}
                </span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: PRIMARY }}>{recipe.cal}</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED }}>kcal</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, textAlign: "center", background: "#FFF3E0", borderRadius: 10, padding: 8 }}>
              <div style={{ fontWeight: 700, color: "#FF7043" }}>{recipe.protein}g</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED }}>Proteína</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", background: "#E3F2FD", borderRadius: 10, padding: 8 }}>
              <div style={{ fontWeight: 700, color: "#1565C0" }}>{recipe.carbs}g</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED }}>Carbos</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", background: "#FCE4EC", borderRadius: 10, padding: 8 }}>
              <div style={{ fontWeight: 700, color: "#880E4F" }}>{recipe.fat}g</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED }}>Grasas</div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, marginBottom: 6 }}>Ingredientes:</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {recipe.ingredients.map(ing => (
                <span key={ing} style={{
                  fontSize: 11, background: BG, color: TEXT, borderRadius: 8,
                  padding: "4px 10px", border: `1px solid ${BORDER}`
                }}>{ing}</span>
              ))}
            </div>
          </div>

          <button onClick={() => {
            onFoodAdded({
              ...recipe,
              id: Date.now(),
              time: new Date().toTimeString().slice(0, 5),
              meal: recipe.category === "Desayuno" ? "Desayuno" :
                recipe.category === "Almuerzo" ? "Almuerzo" :
                  recipe.category === "Snack" ? "Merienda" : "Cena"
            });
          }} style={{
            width: "100%", padding: 12, borderRadius: 14, border: "none",
            background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
          }}>
            + Añadir al diario
          </button>
        </div>
      ))}
    </div>
  );
}

// Pantalla de bienvenida/onboarding
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [height, setHeight] = useState("");

  const steps = [
    {
      emoji: "🥗", title: "Tu nutricionista personal", color: PRIMARY,
      desc: "Welmi te ayuda a alcanzar tu cuerpo ideal con un seguimiento inteligente de tu alimentación."
    },
    {
      emoji: "📷", title: "Escanea tu comida", color: "#42A5F5",
      desc: "Toma una foto de tu plato y la IA detectará automáticamente los alimentos y sus calorías."
    },
    {
      emoji: "🔥", title: "Mantén tu racha", color: "#FF6B35",
      desc: "Regístra tu alimentación cada día y supera tu propio récord de días seguidos."
    },
    {
      emoji: "🎯", title: "¿Cuál es tu objetivo?", isForm: true
    },
  ];

  const currentStep = steps[step];

  if (step < 3) {
    return (
      <div style={{
        minHeight: "100vh", background: BG, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 24
      }}>
        <div style={{
          background: currentStep.color + "20", width: 120, height: 120, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 60, marginBottom: 32
        }}>
          {currentStep.emoji}
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: TEXT, textAlign: "center", marginBottom: 16 }}>
          {currentStep.title}
        </div>
        <div style={{ fontSize: 16, color: TEXT_MUTED, textAlign: "center", lineHeight: 1.6, maxWidth: 320, marginBottom: 48 }}>
          {currentStep.desc}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i === step ? PRIMARY : BORDER, transition: "all 0.3s"
            }} />
          ))}
        </div>
        <button onClick={() => setStep(s => s + 1)} style={{
          background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
          color: "#fff", border: "none", borderRadius: 20, padding: "16px 48px",
          fontSize: 17, fontWeight: 800, cursor: "pointer", width: "100%", maxWidth: 320
        }}>
          {step === 2 ? "Empezar configuración" : "Continuar"}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: BG, padding: 24,
      display: "flex", flexDirection: "column", justifyContent: "center"
    }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: TEXT, marginBottom: 8 }}>🎯 Tu objetivo</div>
      <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 32 }}>Cuéntanos sobre ti para personalizar tu experiencia</div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, marginBottom: 10 }}>¿Qué quieres lograr?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { val: "perder", label: "Perder peso", emoji: "📉" },
            { val: "mantener", label: "Mantener", emoji: "⚖️" },
            { val: "ganar", label: "Ganar músculo", emoji: "💪" },
          ].map(g => (
            <button key={g.val} onClick={() => setGoal(g.val)} style={{
              padding: "16px 8px", borderRadius: 16, border: "2px solid",
              borderColor: goal === g.val ? PRIMARY : BORDER,
              background: goal === g.val ? PRIMARY_LIGHT : CARD,
              color: goal === g.val ? PRIMARY_DARK : TEXT,
              fontWeight: 700, fontSize: 12, cursor: "pointer", textAlign: "center"
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{g.emoji}</div>
              <div>{g.label}</div>
            </button>
          ))}
        </div>
      </div>

      {[
        { label: "Peso actual (kg)", val: weight, set: setWeight, placeholder: "Ej: 75" },
        { label: "Peso objetivo (kg)", val: targetWeight, set: setTargetWeight, placeholder: "Ej: 65" },
        { label: "Altura (cm)", val: height, set: setHeight, placeholder: "Ej: 170" },
      ].map(field => (
        <div key={field.label} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MUTED, marginBottom: 6 }}>{field.label}</div>
          <input
            type="number" value={field.val} onChange={e => field.set(e.target.value)}
            placeholder={field.placeholder}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 16,
              border: `1.5px solid ${BORDER}`, fontSize: 16, color: TEXT,
              background: CARD, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>
      ))}

      <button
        onClick={() => goal && onComplete({ goal, weight: +weight, targetWeight: +targetWeight, height: +height })}
        disabled={!goal}
        style={{
          width: "100%", padding: 16, borderRadius: 20, border: "none",
          background: goal ? `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})` : BORDER,
          color: "#fff", fontWeight: 800, fontSize: 17, cursor: goal ? "pointer" : "not-allowed",
          marginTop: 20, transition: "all 0.2s"
        }}>
        ¡Empezar mi viaje! 🚀
      </button>
    </div>
  );
}

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [foods, setFoods] = useState(SAMPLE_FOODS);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [streak, setStreak] = useState(7);
  const [waterGlasses, setWaterGlasses] = useState(3);

  const addFood = (food) => {
    setFoods(prev => [...prev, food]);
    setActiveTab("diary");
  };

  const deleteFood = (id) => {
    setFoods(prev => prev.filter(f => f.id !== id));
  };

  const handleOnboardingComplete = (data) => {
    if (data.goal === "perder") setCalorieGoal(1600);
    else if (data.goal === "mantener") setCalorieGoal(2000);
    else setCalorieGoal(2400);
    setOnboarded(true);
  };

  if (!onboarded) {
    return (
      <>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${BG}; }
          @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        `}</style>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  const tabs = [
    { id: "home", label: "Inicio", emoji: "🏠" },
    { id: "scanner", label: "Escanear", emoji: "📷" },
    { id: "diary", label: "Diario", emoji: "📔" },
    { id: "progress", label: "Progreso", emoji: "📊" },
    { id: "recipes", label: "Recetas", emoji: "🍽️" },
  ];

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${BG}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 4px; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        input:focus { border-color: ${PRIMARY} !important; box-shadow: 0 0 0 3px ${PRIMARY}30; }
      `}</style>

      <div style={{
        maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        background: BG, position: "relative", overflowX: "hidden"
      }}>
        {/* Header app */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100, background: CARD,
          borderBottom: `1px solid ${BORDER}`, padding: "12px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18
            }}>🥗</div>
            <span style={{ fontSize: 20, fontWeight: 900, color: PRIMARY }}>Welmi</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setActiveTab("progress")} style={{
              background: "none", border: "none", fontSize: 22, cursor: "pointer"
            }}>🔥</button>
            <button onClick={() => setActiveTab("profile")} style={{
              background: PRIMARY_LIGHT, border: "none", borderRadius: 10,
              width: 34, height: 34, fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>👤</button>
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{ animation: "slideUp 0.3s ease", minHeight: "calc(100vh - 130px)", overflowY: "auto" }}>
          {activeTab === "home" && (
            <HomeScreen
              foods={foods}
              calorieGoal={calorieGoal}
              streak={streak}
              onAddFood={() => setActiveTab("scanner")}
              waterGlasses={waterGlasses}
              setWaterGlasses={setWaterGlasses}
            />
          )}
          {activeTab === "scanner" && <ScannerScreen onFoodAdded={addFood} />}
          {activeTab === "diary" && <DiaryScreen foods={foods} onDelete={deleteFood} />}
          {activeTab === "progress" && <ProgressScreen streak={streak} foods={foods} calorieGoal={calorieGoal} />}
          {activeTab === "recipes" && <RecipesScreen onFoodAdded={addFood} />}
          {activeTab === "profile" && (
            <ProfileScreen calorieGoal={calorieGoal} setCalorieGoal={setCalorieGoal} />
          )}
        </div>

        {/* Bottom Navigation */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430,
          background: CARD, borderTop: `1px solid ${BORDER}`,
          display: "flex", padding: "8px 0 20px",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.08)", zIndex: 200
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, border: "none", background: "none", cursor: "pointer",
              padding: "4px 0", transition: "all 0.2s"
            }}>
              <div style={{
                fontSize: tab.id === "scanner" ? 28 : 22,
                background: tab.id === "scanner"
                  ? `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`
                  : "none",
                borderRadius: tab.id === "scanner" ? "50%" : "none",
                width: tab.id === "scanner" ? 48 : "auto",
                height: tab.id === "scanner" ? 48 : "auto",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: tab.id === "scanner" ? -20 : 0,
                boxShadow: tab.id === "scanner" ? "0 4px 16px rgba(76,175,130,0.4)" : "none",
                border: tab.id === "scanner" ? "3px solid #fff" : "none",
                filter: activeTab === tab.id && tab.id !== "scanner" ? "none" : undefined
              }}>
                {tab.emoji}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: activeTab === tab.id ? PRIMARY : TEXT_MUTED,
                transition: "color 0.2s"
              }}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: PRIMARY }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}