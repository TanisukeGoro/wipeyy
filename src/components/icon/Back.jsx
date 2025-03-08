const BackIcon = ({ iconColor = 'currentColor' }) => {
    return (
        <path
            d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
            fill={iconColor}
        />
    );
};

export default BackIcon;