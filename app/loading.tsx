
export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="my-5 text-center">
            <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
            </svg>
        </div>

    )
}