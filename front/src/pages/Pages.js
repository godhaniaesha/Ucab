import React from 'react';
import '../style/x_app.css';

export default function Pages() {
	return (
		<div>
			<main>
				<section className="x_hero_section">
					<div className="x_video_background">
						<video autoPlay muted loop playsInline>
							<source src="https://max-themes.net/demos/limoking/upload/service-video-bg-n.webm" type="video/webm" />
							Your browser does not support the video tag.
						</video>
						<div className="x_video_overlay"></div>
					</div>
					
					<div className="x_hero_content">
						<div className="x_hero_text">
							<h1 className="x_hero_title">OR ANYWHERE YOU NEED US TO TAKE</h1>
							<p className="x_hero_subtitle">
								Not only taking to night parties, weddings, casinos, birthdays but we also take you to anywhere you want to go.
							</p>
							<div className="x_hero_phone">
								CALL NOW (1)-212-333-4343
							</div>
							<div className="x_hero_separator">
								<span className="x_separator_line"></span>
								<span className="x_or_text">OR</span>
								<span className="x_separator_line"></span>
							</div>
							<button className="x_book_online_btn">Book Online</button>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}