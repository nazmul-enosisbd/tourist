import sqlalchemy

engine = sqlalchemy.create_engine('sqlite:///db.sqlite3')
Session = sqlalchemy.orm.sessionmaker(bind=engine, expire_on_commit=False)
sa_session = Session()
