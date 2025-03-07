export default function Map() {
  return (
    <div className="container mx-auto px-4">
      <div className="mt-16 rounded-xl overflow-hidden h-[400px] relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4842318813194!2d106.7692574!3d10.8505788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDUxJzAyLjEiTiAxMDbCsDQ2JzA5LjMiRQ!5e0!3m2!1svi!2s!4v1616603525264!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Google Maps"
        ></iframe>
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  )
}

