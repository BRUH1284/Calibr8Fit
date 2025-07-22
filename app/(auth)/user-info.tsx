import { useAuth } from "@/shared/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserInfo() {
    const theme = useTheme();
    const { register } = useAuth();

    return(
        <SafeAreaView style={{
            flex:1, 
            gap: 32,
            padding: 32,
            justifyContent: 'flex-end',
            backgroundColor: theme.background
        }}>
            
        </SafeAreaView>
    );
}