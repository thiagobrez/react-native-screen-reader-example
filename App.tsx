import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  ViewProps,
} from 'react-native';

type SectionProps = PropsWithChildren<
  ViewProps & {
    title: string;
    subtitle?: string;
    disabled?: boolean;
  }
>;

const theme = {
  colors: {
    primary: '#1292B4',
    white: '#FFF',
    lighter: '#F3F3F3',
    light: '#DAE1E7',
    dark: '#444',
    darker: '#222',
    black: '#000',
  },
  opacity: {
    faded: 0.5,
    opaque: 1,
  },
};

function Section({
  children,
  title,
  subtitle,
  disabled,
  ...props
}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={[
        styles.sectionContainer,
        { opacity: disabled ? theme.opacity.faded : theme.opacity.opaque },
      ]}
      {...props}>
      <Text
        style={[
          styles.sectionTitle,
          { color: isDarkMode ? theme.colors.white : theme.colors.black },
        ]}>
        {title}
      </Text>

      {subtitle && (
        <Text
          style={[
            styles.sectionDescription,
            { color: isDarkMode ? theme.colors.light : theme.colors.dark },
          ]}>
          {subtitle}
        </Text>
      )}

      {children}
    </View>
  );
}

function App(): JSX.Element {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [name, setName] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? theme.colors.darker : theme.colors.lighter,
  };

  useEffect(() => {
    const init = async () => {
      const screenReaderEnabled =
        await AccessibilityInfo.isScreenReaderEnabled();

      setScreenReaderEnabled(screenReaderEnabled);
    };

    init();

    AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled,
    );
  }, []);

  if (!screenReaderEnabled) {
    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDarkMode ? theme.colors.white : theme.colors.black },
          ]}>
          Screen reader is not enabled. Please enable in OS settings
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Section
          title="This section is not accessible"
          subtitle="These 2 texts will be selectable independently"
        />

        <Section
          title="This section is accessible"
          subtitle="These 2 texts will be selectable as one"
          accessible
        />

        <Section
          title="This section has an accessibility label"
          subtitle="The screen reader will only read the label"
          accessible
          accessibilityLabel="This section has an accessibility label"
          accessibilityHint="Does nothing"
        />

        <Section
          title="[iOS] This section will be read in brazilian portuguese"
          subtitle="Even if your screen reader is in another language"
          accessible
          accessibilityLabel="Essa é uma seção em português"
          accessibilityLanguage="pt-BR"
        />

        <Section
          title="[iOS] This section does not invert colors for vision accessibility"
          subtitle="This is more useful if used with an image"
          accessible
          accessibilityLabel="This section does not invert colors for vision accessibility"
          accessibilityIgnoresInvertColors
        />

        <Section
          title="This section has a 'header' role"
          subtitle="Screen reader will read the role for context after the content"
          accessible
          accessibilityLabel="This section has a 'header' role"
          accessibilityRole="header"
        />

        <Section
          title="This is a disabled section"
          subtitle="Screen reader will let the user know this section is faded"
          accessible
          accessibilityLabel="This is a disabled section"
          accessibilityState={{ disabled: true }}
          disabled
        />

        <Section
          title="This is a checked section"
          subtitle="✅ Screen reader will let the user know this section is checked"
          accessible
          accessibilityLabel="This is a checked section"
          accessibilityState={{ checked: true }}
        />

        <Section
          title="This is a busy section"
          subtitle="Screen reader will let the user know this section is busy"
          accessible
          accessibilityLabel="This is a busy section"
          accessibilityState={{ busy: true }}>
          <ActivityIndicator />
        </Section>

        <Section title="This is an input section">
          <TextInput
            style={[
              styles.input,
              { color: isDarkMode ? theme.colors.white : theme.colors.black },
            ]}
            accessibilityLabel="Name"
            accessibilityHint="Type your name"
            accessibilityValue={{ text: name }}
            value={name}
            onChangeText={setName}
          />
        </Section>

        <Section
          title="This section shows an alert when tapped"
          accessible
          accessibilityLabel="This section shows an alert when tapped"
          onAccessibilityTap={() => Alert.alert('Section tapped')}
        />

        <Section
          title="This section responds to accessibility actions"
          subtitle="Magic tap (2 taps with 2 fingers), copy, paste, cut"
          accessible
          accessibilityLabel="This section responds to the magic tap (2 taps with 2 fingers)"
          accessibilityActions={[
            { name: 'magicTap', label: 'Magic Tap' },
            { name: 'cut', label: 'cut' },
            { name: 'copy', label: 'copy' },
            { name: 'paste', label: 'paste' },
          ]}
          onAccessibilityAction={event => {
            switch (event.nativeEvent.actionName) {
              case 'magicTap':
                Alert.alert('Alert', 'Magic Tap action success');
                break;
              case 'cut':
                Alert.alert('Alert', 'cut action success');
                break;
              case 'copy':
                Alert.alert('Alert', 'copy action success');
                break;
              case 'paste':
                Alert.alert('Alert', 'paste action success');
                break;
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: 20,
  },
});

export default App;
