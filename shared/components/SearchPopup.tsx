import { FlatList, Modal, Pressable, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import AppText from './AppText';
import { IconItem } from './DynamicIcon';
import IconButton from './IconButton';
import TextField from './TextField';

type Props = {
  header?: string;
  isVisible: boolean;
  onClose: () => void;
  headerRightIcon?: { iconName: IconItem['name'], iconLibrary: IconItem['library'] };
  searchLabel?: string;
  onChangeText?: (text: string) => void;
  flatListData?: any[];
  flatListDataKeyExtractor?: (item: any) => string;
  flatListRenderItem: React.ComponentType<any>;
};

export default function SearchPopup({
  isVisible,
  onClose,
  header,
  headerRightIcon,
  searchLabel = 'Search',
  onChangeText,
  flatListData,
  flatListDataKeyExtractor,
  flatListRenderItem,
}: Props) {
  const theme = useTheme();

  const renderItem = ({ item }: any) => {
    // Dynamically render the component with its properties
    const Component = flatListRenderItem;
    return <Component {...item} />;
  };

  return (
    <Modal
      animationType='fade'
      statusBarTranslucent={true}
      transparent={true}
      visible={isVisible}
      onDismiss={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Pressable
          onTouchEnd={onClose}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: theme.dialogBackground
          }} />
        <View
          style={{
            backgroundColor: theme.surface,
            margin: 32,
            height: '66%',
            flexGrow: 1,
            borderRadius: 16,
            padding: 16,
            gap: 16
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <IconButton
              onPress={onClose}
              variant='icon'
              icon={{ name: 'arrow-back-ios', library: 'MaterialIcons', size: 24 }}
              style={{ position: 'absolute' }}
            />
            <AppText
              type='title-large'
              style={{
                flex: 1,
                textAlign: 'center',
                marginHorizontal: 32,
              }}
            >{header}</AppText>
            {headerRightIcon && <IconButton
              variant='icon'
              icon={{ name: headerRightIcon.iconName, library: headerRightIcon.iconLibrary, size: 24 }}
              style={{ position: 'absolute', right: 0 }}
            />}
          </View>

          <TextField
            label={searchLabel}
            onChangeText={onChangeText}
          />
          <FlatList
            initialNumToRender={10}
            contentContainerStyle={{ gap: 16 }}
            data={flatListData}
            keyExtractor={flatListDataKeyExtractor}
            renderItem={renderItem}
          />
        </View>
      </View>
    </Modal >
  );
}