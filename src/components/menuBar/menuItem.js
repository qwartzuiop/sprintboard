import React, { useState, useRef, useEffect } from 'react';

import styles from './menuBar.scss';

export function MenuItem({ title, list }) {
    const [isMenuListVisible, setMenuListVisibility] = useState(false);
    const node = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuListVisible]);

    function handleClickOutside(e) {
        if (node.current.contains(e.target)) {
            return
        }
        setMenuListVisibility(false);
    };

    return (
        <div
            className={`${styles.menuItem} ${isMenuListVisible ? styles.active : ''}`}
            onClick={() => setMenuListVisibility(!isMenuListVisible)}
            ref={node}
        >
            {title}
            {isMenuListVisible &&
                <div className={styles.menuList}>
                    {list.map((item, index) => {
                        if (item.title === null) return <div className={styles.listSeparator} key={index}></div>

                        return (
                            <div
                                className={styles.listItem}
                                onClick={item.action}
                                key={index}
                            >
                                {item.title}
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
};