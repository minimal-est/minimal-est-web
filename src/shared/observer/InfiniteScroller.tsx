import { useEffect, useRef, useState } from "react"

const InfiniteScroll = () => {
    const [items, setItems] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const loaderRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const newItems = Array.from({ length: 10 }, (_, i) => `아이템 ${page} - ${i + 1}`);
            setItems(prev => [...prev, ...newItems]);
        };
        fetchData();
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            },
            {
                // root: null,
                // rootMargin: "50px",
                threshold: 1,
            }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    })

    return (
        <div>
            {items.map((item, i) => (
                <div key={i} style={{ height: 80, border: "1px solid #ddd", margin: 4 }}>
                    {item}
                </div>
            ))}
            <div ref={loaderRef} style={{ height: 40, textAlign: "center" }}>

            </div>
        </div>
    )
}

export default InfiniteScroll;