import {
    ShoppingCart,
    Utensils,
    Fuel,
    Film,
    Tv,
    Pill,
    BookOpen,
    Coffee,
    ShoppingBag,
    Shirt,
    GraduationCap,
    Palette,
    Gamepad2,
    Stethoscope,
    Bed,
    Car,
    Cake,
    Users,
    Wallet,
    HelpCircle,
} from "lucide-react"
// Damit wird beim Rendern automatisch das richtige Icon gewählt.
export const iconMap: Record<string, any> = {
    "Kleidung": Shirt,
    "Essen": Utensils,
    "Spielzeug": Gamepad2,
    "Transport": Car,
    "Schule": GraduationCap,
    "Gesundheit": Stethoscope,
    "Kinderzimmer": Bed,
    "Geburtstage": Cake,
    "Betreuung": Users,
    "Finanzen": Wallet,
    "Hobbys": Palette,
    "Sonstiges": HelpCircle,
}
