FROM docker.io/ruby:3.2

RUN gem install jekyll jekyll-sitemap jekyll-seo-tag jekyll-feed

WORKDIR /site
EXPOSE 4000

CMD ["jekyll", "serve", "--host", "0.0.0.0"]
