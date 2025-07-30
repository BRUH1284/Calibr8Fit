import { useProfile } from "@/features/profile/hooks/useProfile";
import { ProfileSettings } from "@/features/profile/types/interfaces/profile";
import TextButton from "@/shared/components/TextButton";
import { useAuth } from "@/shared/hooks/useAuth";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Profile() {
  const { fetchProfileSettings } = useProfile();
  const { logout } = useAuth();

  const [profileSettings, setProfileSettings] = useState<ProfileSettings | undefined>(undefined);

  // Fetch profile settings asynchronously when the component mounts
  useEffect(() => {
    fetchProfileSettings().then(setProfileSettings);
  }, []);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red"
      }}
    >
      <TextButton label="logout" onPress={logout} />
      <Text>{`${profileSettings?.firstName} ${profileSettings?.lastName} Profile.`}</Text>
    </View>
  );
}


// export default function Profile() {
//   return (
//     <ProfileProvider>
//       <ProfileContent />
//     </ProfileProvider>
//   );
// }
