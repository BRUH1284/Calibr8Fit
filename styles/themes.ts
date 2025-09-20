export const LightTheme = {
    isDark: false,
    primary: '#6941C6',
    onPrimary: '#FDFDFD',
    primaryVariant: '#E9D7FE',
    onPrimaryVariant: '#6941C6',
    success: '#12B76A',
    onSuccess: 'white',
    error: '#F04438',
    onError: 'white',
    errorVariant: '#FECDCA',
    onErrorVariant: '#B42318',
    surface: 'white',
    onSurface: '#181D27',
    onSurfaceVariant: '#414651',
    surfaceContainer: '#F5F5F5',
    outline: '#E9EAEB',
    blue: '#53B1FD',
    yellow: '#FEC84B',
    orange: '#FD853A',
    dialogBackground: 'rgba(0, 0, 0, 0.33)',
};

export const DarkTheme = LightTheme;
export type AppTheme = typeof LightTheme;