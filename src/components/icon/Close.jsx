const Close = ({ iconColor = 'currentColor' }) => {
    return (
        <g>
            <line x1="18" y1="6" x2="6" y2="18" stroke={iconColor} />
            <line x1="6" y1="6" x2="18" y2="18" stroke={iconColor} />
        </g>
    );
};

export default Close;
