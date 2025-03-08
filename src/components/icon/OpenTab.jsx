const OpenTab = ({ iconColor = 'currentColor' }) => {
    return (
        <g>
            <polyline points="15 3 21 3 21 9" stroke={iconColor} />
            <path d="M21 3L9 15" stroke={iconColor} />
            <path d="M9 3H3v18h18v-6" stroke={iconColor} />
        </g>
    );
};

export default OpenTab;
